// material-ui
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, Chip, Tabs, Tab, CircularProgress, Switch, FormControlLabel } from '@mui/material';

import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';
import axiosClient from '../../api/axiosClient';
import { showToast } from '../../utils/toast';
import LoadingErrorWrapper from '../../components/LoadingErrorWrapper';
import UniversalActionBar from '../../components/UniversalActionBar';

// Helper to decode JWT token
const getCurrentLecturerId = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload._id || payload.userId || payload.sub || payload.lecturerId || payload.lecturer_id;
  } catch (e) {
    console.error('Failed to decode token', e);
    return null;
  }
};

export default function AttendanceMarking() {
  const currentLecturerId = getCurrentLecturerId();

  // ---------- FETCH LECTURES ----------
  const { data: lecturesData, error: lecturesError, mutate: mutateLectures } = useSWR('/lecture/find/', fetcher);
  const allLectures = lecturesData?.lecture || lecturesData?.lectures || lecturesData?.data?.lecture || lecturesData?.data?.lectures || [];
  const myLectures = currentLecturerId ? allLectures.filter(l => {
    const lId = typeof l.lecturer === 'string' ? l.lecturer : (l.lecturer?._id || l.lecturer?.id);
    return lId === currentLecturerId;
  }) : [];

  // ---------- FETCH ATTENDANCE HISTORY ----------
  const { data: attendanceData, error: attendanceError, mutate: mutateAttendance } = useSWR(
    currentLecturerId ? ['/attendance/find/', { lecturer: currentLecturerId }] : null,
    fetcher
  );
  const attendanceRecords = attendanceData?.attendance || attendanceData?.data?.attendance || attendanceData?.records || [];

  // ---------- STATE ----------
  const [tabValue, setTabValue] = useState(0);
  const [selectedLectureId, setSelectedLectureId] = useState('');
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch attendance for selected lecture (to prefill)
  const { data: lectureAttendanceData } = useSWR(
    selectedLectureId ? ['/attendance/find/', { lecture: selectedLectureId }] : null,
    fetcher
  );
  const lectureAttendanceRecords = lectureAttendanceData?.attendance || lectureAttendanceData?.data?.attendance || lectureAttendanceData?.records || [];

  // ---------- EFFECTS ----------
  // Fetch registered students when selected lecture changes
  useEffect(() => {
    if (!selectedLectureId) {
      setRegisteredStudents([]);
      setAttendanceMap({});
      return;
    }

    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const selectedLecture = myLectures.find(l => l.id === selectedLectureId || l._id === selectedLectureId);
        if (!selectedLecture) return;

        const subjectRef = selectedLecture.subject;
        const semesterRef = selectedLecture.semester;

        const subjectId = typeof subjectRef === 'string' ? subjectRef : subjectRef?._id || subjectRef?.id;
        const semesterId = typeof semesterRef === 'string' ? semesterRef : semesterRef?._id || semesterRef?.id;

        if (!subjectId || !semesterId) return;

        const response = await axiosClient.post('/subject-registration/find/', { subject: subjectId, semester: semesterId });
        const registrations = response.data.registrations || [];
        const students = registrations.map(reg => {
          const s = reg.student;
          if (s && typeof s === 'object' && s._id) return s;
          if (typeof s === 'string') {
            return { id: s };
          }
          return null;
        }).filter(Boolean);

        setRegisteredStudents(students);
      } catch (err) {
        console.error('Failed to load registered students:', err);
        showToast({ text: 'Failed to load students', type: 'error' });
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [selectedLectureId, myLectures]);

  // Set attendance map when lecture attendance records change
  useEffect(() => {
    if (!selectedLectureId) {
      setAttendanceMap({});
      return;
    }
    const map = {};
    lectureAttendanceRecords.forEach(att => {
      const studentId = typeof att.student === 'string' ? att.student : att.student?._id || att.student?.id;
      map[studentId] = att.status || 'PRESENT';
    });
    setAttendanceMap(map);
  }, [lectureAttendanceRecords, selectedLectureId]);

  // ---------- HANDLERS ----------
  const handleAttendanceChange = (studentId, status) => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedLectureId) return;
    setSaving(true);
    try {
      const promises = registeredStudents.map(student => {
        const studentId = typeof student === 'string' ? student : (student.id || student._id);
        const status = attendanceMap[studentId] || 'ABSENT';
        return axiosClient.post('/attendance/', {
          lecture: selectedLectureId,
          student: studentId,
          status: status
        });
      });
      await Promise.all(promises);
      showToast({ text: 'Attendance saved successfully', type: 'success' });
      mutateAttendance();
    } catch (err) {
      console.error('Save attendance error:', err);
      showToast({ text: 'Failed to save attendance', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Helper to get student name
  const getStudentName = (student) => {
    if (!student) return '-';
    if (typeof student === 'string') return student;
    return student.name?.full_name || student.registration_id || `ID: ${student.id || student._id || 'Unknown'}`;
  };

  // Helper to get lecture topic
  const getLectureTopic = (lectureId) => {
    const lec = myLectures.find(l => l.id === lectureId || l._id === lectureId);
    return lec?.topic?.substring(0, 30) || 'Unknown';
  };

  // Helper to get lecture date
  const getLectureDate = (lectureId) => {
    const lec = myLectures.find(l => l.id === lectureId || l._id === lectureId);
    return lec?.scheduledTime ? new Date(lec.scheduledTime).toLocaleDateString() : '-';
  };

  // Render Tab Panel
  const TabPanel = ({ children, value, index, ...other }) => (
    <div role="tabpanel" hidden={value !== index} {...other}>{value === index && children}</div>
  );

  // Loading and error states
  if (lecturesError || attendanceError) {
    return <LoadingErrorWrapper isLoading={false} isError />;
  }
  if (!lecturesData || !attendanceData) {
    return <LoadingErrorWrapper isLoading isError={false} />;
  }

  return (
    <MainCard title="Attendance Marking">
      <UniversalActionBar
        buttons={[
          { label: 'Open Help', type: 'help' }
        ]}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Mark Attendance" />
          <Tab label="Attendance History" />
        </Tabs>
      </Box>

      {/* TAB: MARK ATTENDANCE */}
      <TabPanel value={tabValue} index={0}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Lecture</InputLabel>
          <Select
            value={selectedLectureId}
            label="Select Lecture"
            onChange={(e) => setSelectedLectureId(e.target.value)}
          >
            {myLectures.map((lec) => (
              <MenuItem key={lec.id || lec._id} value={lec.id || lec._id}>
                {lec.topic?.substring(0, 50)} - {new Date(lec.scheduledTime).toLocaleDateString()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedLectureId && (
          <>
            {loadingStudents ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
              </Box>
            ) : registeredStudents.length === 0 ? (
              <Typography>No registered students for this lecture's subject and semester.</Typography>
            ) : (
              <>
                <Paper sx={{ maxHeight: 400, overflowY: 'auto', mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell align="center">Present</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {registeredStudents.map((student) => {
                        const studentId = student.id || student._id;
                        const isPresent = attendanceMap[studentId] === 'PRESENT';
                        return (
                          <TableRow key={studentId}>
                            <TableCell>{getStudentName(student)}</TableCell>
                            <TableCell align="center">
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={isPresent}
                                    onChange={(e) => handleAttendanceChange(studentId, e.target.checked ? 'PRESENT' : 'ABSENT')}
                                    color="success"
                                  />
                                }
                                label={isPresent ? 'Present' : 'Absent'}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Paper>
                <Button variant="contained" color="success" onClick={handleSaveAttendance} disabled={saving}>
                  {saving ? <CircularProgress size={24} /> : 'Save Attendance'}
                </Button>
              </>
            )}
          </>
        )}
      </TabPanel>

      {/* TAB: ATTENDANCE HISTORY */}
      <TabPanel value={tabValue} index={1}>
        {attendanceRecords.length === 0 ? (
          <Typography>No attendance records found.</Typography>
        ) : (
          <Paper sx={{ maxHeight: 400, overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Lecture</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords.map((rec, idx) => {
                  const lectureId = typeof rec.lecture === 'string' ? rec.lecture : rec.lecture?._id || rec.lecture?.id;
                  const studentId = typeof rec.student === 'string' ? rec.student : rec.student?._id || rec.student?.id;
                  const lectureTopic = getLectureTopic(lectureId);
                  const studentName = registeredStudents.find(st => st.id === studentId || st._id === studentId)?.name?.full_name
                    || `ID: ${studentId}`;
                  const date = getLectureDate(lectureId);
                  const status = rec.status || 'PRESENT';
                  return (
                    <TableRow key={rec.id || idx}>
                      <TableCell>{date}</TableCell>
                      <TableCell>{lectureTopic}</TableCell>
                      <TableCell>{studentName}</TableCell>
                      <TableCell align="center">
                        <Chip label={status} color={status === 'PRESENT' ? 'success' : 'error'} size="small" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}
      </TabPanel>
    </MainCard>
  );
}
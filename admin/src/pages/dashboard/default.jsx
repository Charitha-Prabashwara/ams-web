// material-ui
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

// third-party
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';

// icons
import UserOutlined from '@ant-design/icons/UserOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';
import BookOutlined from '@ant-design/icons/BookOutlined';
import ApartmentOutlined from '@ant-design/icons/ApartmentOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';

// ==============================|| DASHBOARD - ACADEMIC MANAGEMENT ||============================== //

const StatCard = ({ title, value, icon, color, change }) => (
  <MainCard border={false} content={false}>
    <Box sx={{ p: 2.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
          {change !== undefined && (
            <Typography variant="body2" color={change >= 0 ? 'success.main' : 'error.main'}>
              {change >= 0 ? '+' : ''}{change}% from last month
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.lighter`,
            color: `${color}.main`,
            borderRadius: 1,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Box>
  </MainCard>
);

export default function DashboardDefault() {
  // Fetch real academic data
  const { data: studentsData, isLoading: studentsLoading } = useSWR(['/admin/find/', { type: 'student' }], fetcher);
  const { data: lecturersData, isLoading: lecturersLoading } = useSWR(['/admin/find/', { type: 'lecturer' }], fetcher);
  const { data: coursesData, isLoading: coursesLoading } = useSWR('/course/find/', fetcher);
  const { data: departmentsData, isLoading: departmentsLoading } = useSWR('/department/find/', fetcher);
  const { data: semestersData, isLoading: semestersLoading } = useSWR('/semester/find/', fetcher);

  const studentsCount = studentsData?.data?.users?.length || 0;
  const lecturersCount = lecturersData?.data?.users?.length || 0;
  const coursesCount = coursesData?.courses?.length || 0;
  const departmentsCount = departmentsData?.departments?.length || 0;
  const semestersCount = semestersData?.semesters?.length || 0;

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid size={12}>
        <Typography variant="h4" fontWeight="bold">
          Academic Management Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of your academic institution
        </Typography>
      </Grid>

      {/* Statistics Cards */}
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
        <StatCard
          title="Total Students"
          value={studentsCount}
          icon={<UserOutlined style={{ fontSize: '1.5rem' }} />}
          color="primary"
          change={12}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
        <StatCard
          title="Total Lecturers"
          value={lecturersCount}
          icon={<TeamOutlined style={{ fontSize: '1.5rem' }} />}
          color="secondary"
          change={5}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
        <StatCard
          title="Active Courses"
          value={coursesCount}
          icon={<BookOutlined style={{ fontSize: '1.5rem' }} />}
          color="success"
          change={8}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
        <StatCard
          title="Departments"
          value={departmentsCount}
          icon={<ApartmentOutlined style={{ fontSize: '1.5rem' }} />}
          color="warning"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
        <StatCard
          title="Current Semesters"
          value={semestersCount}
          icon={<CalendarOutlined style={{ fontSize: '1.5rem' }} />}
          color="info"
        />
      </Grid>

      {/* Enrollment Chart */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <MainCard title="Enrollment Trends">
          <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">
              Enrollment chart will be displayed here
            </Typography>
          </Box>
        </MainCard>
      </Grid>

      {/* Quick Stats */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <MainCard title="Quick Statistics">
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Average Students per Course
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {coursesCount > 0 ? Math.round(studentsCount / coursesCount) : 0}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Student-Lecturer Ratio
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {lecturersCount > 0 ? (studentsCount / lecturersCount).toFixed(1) : 0}:1
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Courses per Department
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {departmentsCount > 0 ? Math.round(coursesCount / departmentsCount) : 0}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Active Semesters
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {semestersCount}
              </Typography>
            </Box>
          </Stack>
        </MainCard>
      </Grid>

      {/* Recent Students Table */}
      <Grid size={{ xs: 12 }}>
        <MainCard title="Recent Students">
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Student management functionality - View all students, add new students, manage records
            </Typography>
          </Box>
        </MainCard>
      </Grid>

      {/* Recent Lectures */}
      <Grid size={{ xs: 12 }}>
        <MainCard title="Upcoming Lectures">
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Lecture scheduling and management - View upcoming lectures, schedule new sessions
            </Typography>
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}
// material-ui
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';

// project imports
import MainCard from 'components/MainCard';
import { LineChart } from '@mui/x-charts/LineChart';

// third-party
import useSWR from 'swr';
import { fetcher } from 'api/fetcher';

// icons
import UserOutlined from '@ant-design/icons/UserOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';
import BookOutlined from '@ant-design/icons/BookOutlined';
import ApartmentOutlined from '@ant-design/icons/ApartmentOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import DatabaseOutlined from '@ant-design/icons/DatabaseOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';
import HddOutlined from '@ant-design/icons/HddOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';

// ==============================|| DASHBOARD - ACADEMIC & SYSTEM MANAGEMENT ||============================== //

const StatCard = ({ title, value, icon, color, change, subtitle }) => (
  <MainCard border={false} content={false}>
    <Box sx={{ p: 2.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          {change !== undefined && (
            <Typography variant="body2" color={change >= 0 ? 'success.main' : 'error.main'} sx={{ mt: 0.5 }}>
              {change >= 0 ? <RiseOutlined /> : <FallOutlined />} {Math.abs(change)}% from last week
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

const ResourceCard = ({ title, used, total, icon, color, unit = '' }) => {
  const percentage = total > 0 ? Math.round((used / total) * 100) : 0;
  
  return (
    <MainCard border={false} content={false}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                backgroundColor: `${color}.lighter`,
                color: `${color}.main`,
                borderRadius: 1,
                p: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
            <Typography variant="subtitle2">{title}</Typography>
          </Box>
          <Chip 
            label={`${percentage}%`} 
            size="small" 
            color={percentage > 80 ? 'error' : percentage > 60 ? 'warning' : 'success'}
            variant="outlined"
          />
        </Stack>
        <LinearProgress 
          variant="determinate" 
          value={percentage} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: `${color}.lighter`,
            '& .MuiLinearProgress-bar': {
              backgroundColor: color
            }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Used: {used}{unit} / {total}{unit}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {100 - percentage}% free
          </Typography>
        </Box>
      </Box>
    </MainCard>
  );
};

const TrafficChart = () => {
  // Mock traffic data (replace with real API data)
  const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
  const xValues = [0, 1, 2, 3, 4, 5];
  const inboundData = [1200, 800, 2500, 3200, 2800, 1800];
  const outboundData = [800, 600, 1800, 2400, 2100, 1400];

  return (
    <MainCard title="Network Traffic (Today)">
      <Box sx={{ height: 300, p: 2 }}>
        <LineChart
          xAxis={[{ 
            data: xValues,
            scaleType: 'point',
            tickValues: xValues,
            tickLabelFormatter: (value) => labels[value]
          }]}
          series={[
            { data: inboundData, label: 'Inbound (MB)', color: '#1976d2', strokeWidth: 2 },
            { data: outboundData, label: 'Outbound (MB)', color: '#dc004e', strokeWidth: 2 }
          ]}
          height={300}
          grid={{ vertical: true, horizontal: true }}
          margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
          legend={{ direction: 'row', position: { vertical: 'top', horizontal: 'right' } }}
          sx={{
            '& .MuiChartsAxis-tickLabel': { fontSize: 12 },
            '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { transform: 'translateY(10px)' }
          }}
        />
      </Box>
    </MainCard>
  );
};

const CPUHistoryChart = () => {
  // Mock CPU history data (replace with real API data)
  const labels = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  const xValues = [0, 1, 2, 3, 4, 5, 6];
  const cpuUsageData = [45, 52, 67, 73, 58, 48, 62];

  return (
    <MainCard title="CPU Usage History">
      <Box sx={{ height: 300, p: 2 }}>
        <LineChart
          xAxis={[{ 
            data: xValues,
            scaleType: 'point',
            tickValues: xValues,
            tickLabelFormatter: (value) => labels[value]
          }]}
          series={[
            { 
              data: cpuUsageData, 
              label: 'CPU Usage (%)', 
              color: '#2e7d32',
              strokeWidth: 3,
              showMark: true,
              mark: { fill: '#2e7d32', strokeWidth: 2, r: 4 }
            }
          ]}
          height={300}
          grid={{ vertical: true, horizontal: true }}
          margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
          yAxis={[
            {
              max: 100,
              label: 'Usage %'
            }
          ]}
          sx={{
            '& .MuiChartsAxis-tickLabel': { fontSize: 12 },
            '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { transform: 'translateY(10px)' }
          }}
        />
      </Box>
    </MainCard>
  );
};

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DashboardDefault() {
  const [activeTab, setActiveTab] = useState(0);

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

  // System metrics (mock data - replace with real API calls)
  const systemMetrics = {
    cpuUsage: 67,
    ramUsage: 8.2,
    ramTotal: 16,
    diskUsage: 245,
    diskTotal: 500,
    dbSize: 12.4,
    dbTotal: 50,
    networkInbound: 2.4,
    networkOutbound: 1.8,
    activeUsers: 156,
    totalUsers: 2847,
    serverUptime: '15d 7h 23m'
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Grid container spacing={3}>
      {/* Header with Tabs */}
      <Grid size={12}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          Institutional Management System
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Comprehensive overview of academic and system performance
        </Typography>
        
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Academic Dashboard" />
          <Tab label="System Dashboard" />
        </Tabs>
      </Grid>

      {/* Academic Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
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

          {/* Quick Statistics */}
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

          {/* Enrollment Chart Placeholder */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <MainCard title="Enrollment Trends">
              <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Enrollment chart will be displayed here
                </Typography>
              </Box>
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
      </TabPanel>

      {/* System Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          {/* System Overview Cards */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <StatCard
              title="Active Users"
              value={systemMetrics.activeUsers}
              icon={<ProfileOutlined style={{ fontSize: '1.5rem' }} />}
              color="success"
              change={8}
              subtitle={`of ${systemMetrics.totalUsers} total`}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <StatCard
              title="Network Inbound"
              value={`${systemMetrics.networkInbound} GB`}
              icon={<RiseOutlined style={{ fontSize: '1.5rem' }} />}
              color="info"
              change={15}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <StatCard
              title="Network Outbound"
              value={`${systemMetrics.networkOutbound} GB`}
              icon={<FallOutlined style={{ fontSize: '1.5rem' }} />}
              color="warning"
              change={-5}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <StatCard
              title="Database Size"
              value={`${systemMetrics.dbSize} GB`}
              icon={<DatabaseOutlined style={{ fontSize: '1.5rem' }} />}
              color="error"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <StatCard
              title="Server Uptime"
              value="15d"
              icon={<ClockCircleOutlined style={{ fontSize: '1.5rem' }} />}
              color="secondary"
            />
          </Grid>

          {/* Resource Monitoring */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ResourceCard
              title="CPU Usage"
              used={systemMetrics.cpuUsage}
              total={100}
              icon={<SettingOutlined />}
              color="primary"
              unit="%"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ResourceCard
              title="RAM Usage"
              used={systemMetrics.ramUsage}
              total={systemMetrics.ramTotal}
              icon={<HddOutlined />}
              color="success"
              unit=" GB"
            />
          </Grid>

          {/* Server Capacity */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ResourceCard
              title="Disk Storage"
              used={systemMetrics.diskUsage}
              total={systemMetrics.diskTotal}
              icon={<DatabaseOutlined />}
              color="warning"
              unit=" GB"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ResourceCard
              title="Database Capacity"
              used={systemMetrics.dbSize}
              total={systemMetrics.dbTotal}
              icon={<FileTextOutlined />}
              color="error"
              unit=" GB"
            />
          </Grid>

          {/* Traffic Chart */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TrafficChart />
          </Grid>

          {/* CPU History Chart */}
          <Grid size={{ xs: 12, md: 4 }}>
            <CPUHistoryChart />
          </Grid>

          {/* System Info */}
          <Grid size={{ xs: 12 }}>
            <MainCard title="System Information">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Server Status</Typography>
                    <Chip label="Online" color="success" size="small" sx={{ mt: 0.5 }} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Database Status</Typography>
                    <Chip label="Connected" color="success" size="small" sx={{ mt: 0.5 }} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Last Backup</Typography>
                    <Typography variant="body1">2 hours ago</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">System Load</Typography>
                    <Typography variant="body1">1.42 (High)</Typography>
                  </Box>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </TabPanel>
    </Grid>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ContactsAdminPage = () => {
  const supabase = createClientComponentClient();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch messages from Supabase
  const fetchMessages = async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('contact_messages')
        .select('*', { count: 'exact' });
      
      // Apply status filter if not "all"
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Apply pagination
      const from = page * rowsPerPage;
      const to = from + rowsPerPage - 1;
      
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      
      setMessages(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchMessages();
  }, [page, rowsPerPage, statusFilter]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open message detail dialog
  const handleOpenMessage = (message) => {
    setSelectedMessage(message);
    setOpenDialog(true);
    
    // If this is the first time viewing, update status from 'new' to 'viewed'
    if (message.status === 'new') {
      updateMessageStatus(message.id, 'viewed');
    }
  };

  // Close message detail dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setResponseText('');
  };

  // Update message status
  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', messageId);
      
      if (error) {
        console.error('Error updating message status:', error);
        return;
      }
      
      // Update local state
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, status: newStatus } : msg
        )
      );
      
      // If in detail view, update selected message too
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  // Send response email
  const handleSendResponse = async () => {
    if (!selectedMessage || !responseText.trim()) return;

    try {
      // Call API route to send email (we'll create this next)
      const response = await fetch('/api/contact/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          recipientEmail: selectedMessage.email,
          recipientName: selectedMessage.name,
          subject: `Re: ${selectedMessage.subject}`,
          responseText,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send response');
      }

      // Update message status to 'responded'
      updateMessageStatus(selectedMessage.id, 'responded');
      
      // Close dialog
      handleCloseDialog();
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Failed to send response: ' + error.message);
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);
      
      if (error) {
        console.error('Error deleting message:', error);
        return;
      }
      
      // Update local state
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== messageId)
      );
      
      // Close dialog if open
      if (openDialog && selectedMessage && selectedMessage.id === messageId) {
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Format timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-ZM', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  // Render status chip
  const renderStatusChip = (status) => {
    switch (status) {
      case 'new':
        return <Chip color="primary" size="small" label="New" />;
      case 'viewed':
        return <Chip color="info" size="small" label="Viewed" />;
      case 'responded':
        return <Chip color="success" size="small" label="Responded" icon={<CheckCircleIcon />} />;
      case 'pending':
        return <Chip color="warning" size="small" label="Pending" icon={<AccessTimeIcon />} />;
      default:
        return <Chip size="small" label={status} />;
    }
  };

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Contact Form Submissions
          </Typography>
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Messages</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="viewed">Viewed</MenuItem>
              <MenuItem value="responded">Responded</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Province</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">Loading...</TableCell>
                  </TableRow>
                ) : messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No messages found</TableCell>
                  </TableRow>
                ) : (
                  messages.map((message) => (
                    <TableRow 
                      key={message.id}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                        bgcolor: message.status === 'new' ? 'rgba(33, 150, 243, 0.05)' : 'inherit'
                      }}
                      onClick={() => handleOpenMessage(message)}
                    >
                      <TableCell>{formatDate(message.created_at)}</TableCell>
                      <TableCell>{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell>{message.subject}</TableCell>
                      <TableCell>{message.province || '-'}</TableCell>
                      <TableCell>{renderStatusChip(message.status)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Respond">
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenMessage(message);
                            }}
                          >
                            <EmailIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMessage(message.id);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>

      {/* Message Detail Dialog */}
      {selectedMessage && (
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" component="div">
              {selectedMessage.subject}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              From: {selectedMessage.name} ({selectedMessage.email})
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Received: {formatDate(selectedMessage.created_at)}
            </Typography>
            <Box sx={{ mt: 1 }}>
              {renderStatusChip(selectedMessage.status)}
            </Box>
          </DialogTitle>
          
          <DialogContent dividers>
            <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
              <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedMessage.message}
              </Typography>
            </Paper>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Respond to this message:</Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                placeholder="Type your response here..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
              />
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
            <Box>
              <Button 
                onClick={() => updateMessageStatus(selectedMessage.id, 'pending')}
                color="warning"
                sx={{ mr: 1 }}
              >
                Mark as Pending
              </Button>
              <Button 
                onClick={() => handleDeleteMessage(selectedMessage.id)}
                color="error"
              >
                Delete
              </Button>
            </Box>
            <Box>
              <Button onClick={handleCloseDialog} sx={{ mr: 1 }}>
                Close
              </Button>
              <Button 
                onClick={handleSendResponse} 
                variant="contained" 
                color="primary"
                disabled={!responseText.trim()}
              >
                Send Response
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ContactsAdminPage; 
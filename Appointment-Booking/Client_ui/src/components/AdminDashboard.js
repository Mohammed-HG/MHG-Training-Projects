import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState({}); // لتخزين ملاحظات المسؤول لكل موعد

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://127.0.0.1:3600/api/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      alert('حدث خطأ أثناء جلب البيانات');
    }
    setLoading(false);
  };

  const handleUpdate = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://127.0.0.1:3600/api/appointments/${id}`, {
        status,
        adminNotes: adminNotes[id] || '', // إرسال الملاحظات الخاصة بهذا الموعد
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 200 || response.status === 201) {
        alert('تم تحديث حالة الموعد');
        fetchAppointments();
      }
    } catch (error) {
      alert('حدث خطأ أثناء تحديث الموعد');
    }
  };

  const handleAdminNotesChange = (id, value) => {
    setAdminNotes({ ...adminNotes, [id]: value });
  };

  return (
    <div className="admin-dashboard">
      <h2>لوحة تحكم المسؤول</h2>
      {loading ? <p>جاري التحميل...</p> : (
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>التاريخ</th>
              <th>السبب</th>
              <th>الحالة</th>
              <th>ملاحظات المسؤول</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app.id}>
                <td>{app.name}</td>
                <td>{new Date(app.date).toLocaleDateString()}</td>
                <td>{app.reason}</td>
                <td>{app.status}</td>
                <td>
                  <textarea
                    value={adminNotes[app.id] || ''}
                    onChange={(e) => handleAdminNotesChange(app.id, e.target.value)}
                  />
                </td>
                <td>
                  <button className="approve-button" onClick={() => handleUpdate(app.id, 'Approved')}>قبول</button>
                  <button className="reject-button" onClick={() => handleUpdate(app.id, 'Rejected')}>رفض</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;

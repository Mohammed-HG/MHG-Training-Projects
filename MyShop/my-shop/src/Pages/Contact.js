import React from 'react';

function Contact() {
  return (
    <div className="container my-4">
      <h1>الاتصال</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">الاسم</label>
          <input type="text" className="form-control" id="name" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
          <input type="email" className="form-control" id="email" />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">الرسالة</label>
          <textarea className="form-control" id="message"></textarea>
        </div>
        <button type="submit" className="btn btn-primary">إرسال</button>
      </form>
    </div>
  );
}

export default Contact;

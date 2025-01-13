import { useState } from 'react';
import { Mail, Phone, MapPin, Send, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    error: null,
    success: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, error: null, success: false });

    try {
      const templateParams = {
        from_name: formData.name,
        reply_to: formData.email,
        subject: formData.subject,
        message: formData.message
      };

      const response = await emailjs.send(
        'service_vozudsq',
        'template_wm9coqk',
        templateParams,
        'Z5bnNfX8i2DocKic6'
      );

      if (response.status !== 200) {
        throw new Error(response.text || 'Failed to send message');
      }

      setStatus({ submitting: false, error: null, success: true });
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false }));
      }, 5000);

    } catch (error) {
      let errorMessage = 'Failed to send message. Please try again.';

      if (error.text?.includes('Invalid grant')) {
        errorMessage = 'Email service authentication failed. Please try again later or contact support.';
      } else if (error.status === 412) {
        errorMessage = 'Email service configuration error. Please try again later or contact support.';
      }

      setStatus({ submitting: false, error: errorMessage, success: false });
      console.error('Contact form error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (status.error) {
      setStatus((prev) => ({ ...prev, error: null }));
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />, title: "Email", content: "contact@example.com"
    },
    {
      icon: <Phone className="w-6 h-6" />, title: "Phone", content: "+1 (123) 456-7890"
    },
    {
      icon: <MapPin className="w-6 h-6" />, title: "Address", content: "123 Language St, Learning City, LC 12345"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Get in Touch</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <div key={index} className="text-center p-6 border rounded-lg hover:shadow-lg transition duration-300">
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-4 text-blue-600">
                {info.icon}
              </div>
              <h3 className="font-semibold mb-2">{info.title}</h3>
              <p className="text-gray-600">{info.content}</p>
            </div>
          ))}
        </div>

        {status.success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-700">
            Message sent successfully!
          </div>
        )}

        {status.error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                     className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                     className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input type="text" name="subject" value={formData.subject} onChange={handleChange} required
                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required rows="5"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <button type="submit" disabled={status.submitting}
                  className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 ${status.submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}>
            <Send className="w-5 h-5"/>
            {status.submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

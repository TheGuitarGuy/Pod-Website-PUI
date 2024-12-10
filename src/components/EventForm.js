// src/components/EventForm.js

import React, { useState, useEffect, useRef } from 'react';
import { auth, db, storage, onAuthStateChanged, serverTimestamp, Timestamp } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';
import Flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import '../styles/event-form.css';
import backgroundImage from '../images/pod-web-bg.png'; // Updated import
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';

const EventForm = () => {
  const [form, setForm] = useState({
    eventName: '',
    eventInfo: '',
    maxAttendees: '',
    eventPrice: '',
    eventStartDate: '',
    eventEndDate: '',
    eventAddress: '',
  });
  const [photo, setPhoto] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [eventID, setEventID] = useState(null);
  const [photoURL, setPhotoURL] = useState('');
  const [user, setUser] = useState(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const posterRef = useRef(null);

  const formSteps = [
    { id: 'step1', fields: ['eventName', 'eventInfo'] },
    { id: 'step2', fields: ['eventStartDate', 'eventEndDate'] },
    { id: 'step3', fields: ['eventAddress'] },
    { id: 'step4', fields: ['maxAttendees'] },
    { id: 'step5', fields: ['eventPrice'] },
    { id: 'step6', fields: ['photo'] },
  ];

  useEffect(() => {
    // Set the CSS variable for the background image
    document.documentElement.style.setProperty('--podWebBg', `url(${backgroundImage})`);
  }, []);

  useEffect(() => {
    // Initialize Flatpickr for date inputs
    const startDatePicker = Flatpickr('#eventStartDate', {
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      onChange: (selectedDates, dateStr) => {
        setForm((prev) => ({ ...prev, eventStartDate: dateStr }));
      },
    });

    const endDatePicker = Flatpickr('#eventEndDate', {
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      onChange: (selectedDates, dateStr) => {
        setForm((prev) => ({ ...prev, eventEndDate: dateStr }));
      },
    });

    // Cleanup on unmount
    return () => {
      startDatePicker.destroy();
      endDatePicker.destroy();
    };
  }, []);

  useEffect(() => {
    // Initialize Google Places Autocomplete
    const initAutocomplete = () => {
      const input = document.getElementById('eventAddress');
      if (!input) return;

      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        types: ['geocode'],
        componentRestrictions: { country: 'us' },
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setForm((prev) => ({
            ...prev,
            eventAddress: place.formatted_address || input.value,
          }));
        }
      });
    };

    if (window.google) {
      initAutocomplete();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => initAutocomplete();
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // Handle user authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Redirect to login page if not authenticated
        window.location.href = '/auth'; // Updated to use React routing
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create an event.');
      return;
    }

    try {
      // Generate a unique document ID for the new event
      const eventRef = doc(collection(db, 'events'));
      const newEventID = eventRef.id;

      let uploadedPhotoURL = '';

      // Upload the photo if provided
      if (photo) {
        const storageRefPath = ref(storage, `eventImages/${newEventID}.${photo.name.split('.').pop()}`);
        await uploadBytes(storageRefPath, photo);
        uploadedPhotoURL = await getDownloadURL(storageRefPath);
        setPhotoURL(uploadedPhotoURL);
      }

      // Convert start and end dates to Firestore Timestamps
      const startDate = form.eventStartDate
        ? Timestamp.fromDate(new Date(form.eventStartDate))
        : null;
      const endDate = form.eventEndDate
        ? Timestamp.fromDate(new Date(form.eventEndDate))
        : null;

      // Prepare event data
      const eventData = {
        eventId: newEventID,
        eventName: form.eventName,
        eventInfo: form.eventInfo,
        eventStartDate: startDate,
        eventEndDate: endDate,
        eventAddress: form.eventAddress,
        photoURL: uploadedPhotoURL,
        maxAttendees: parseInt(form.maxAttendees),
        attendeeCount: 0,
        price: form.eventPrice,
        timestamp: serverTimestamp(),
        createdBy: user.uid, // Optional: Track which user created the event
      };

      // Write event data to Firestore
      await setDoc(eventRef, eventData);

      // Optionally, create a conversation associated with the event
      await createConversation(newEventID, form.eventName, endDate);
      setEventID(newEventID);
      setQrGenerated(true);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const createConversation = async (eventID, eventName, eventEndDate) => {
    try {
      const conversationData = {
        conversationID: eventID,
        eventEndDate: eventEndDate,
        lastMessage: "",
        members: [], // No user added to the members list
        name: eventName,
        photoURLs: [],
        timestamp: serverTimestamp()
      };
      const conversationRef = doc(db, 'conversations', eventID);
      await setDoc(conversationRef, conversationData);
      console.log('Conversation created successfully!');
    } catch (error) {
      console.error('Error creating conversation: ', error);
    }
  };

  const downloadPoster = async () => {
    if (posterRef.current) {
      try {
        const canvas = await html2canvas(posterRef.current, { useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `event-${eventID}-poster.png`;
        link.click();
      } catch (error) {
        console.error('Error generating poster image:', error);
        alert('Failed to generate poster image. Please try again.');
      }
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="container">
      <div className="title" id="form-title">Tell us a little about your event</div>
      {!qrGenerated ? (
        <>
          <div className="progress-bar" id="progress-bar">
            {formSteps.map((_, index) => (
              <div
                key={index}
                className={`progress-section ${
                  index <= currentStep ? 'progress-section-active' : ''
                }`}
              ></div>
            ))}
          </div>
          <form onSubmit={handleSubmit} id="eventForm">
            {formSteps.map((step, index) => (
              <div
                key={step.id}
                className={`form-step ${index === currentStep ? 'form-step-active' : ''}`}
              >
                {step.fields.includes('eventName') && (
                  <div className="form-group">
                    <label htmlFor="eventName">Event Name</label>
                    <input
                      type="text"
                      id="eventName"
                      name="eventName"
                      placeholder="e.g., Annual Tech Conference"
                      onChange={handleInputChange}
                      value={form.eventName}
                      required
                    />
                  </div>
                )}
                {step.fields.includes('eventInfo') && (
                  <div className="form-group">
                    <label htmlFor="eventInfo">Event Info</label>
                    <textarea
                      id="eventInfo"
                      name="eventInfo"
                      placeholder="Describe your event here..."
                      onChange={handleInputChange}
                      value={form.eventInfo}
                      required
                    ></textarea>
                  </div>
                )}
                {step.fields.includes('eventStartDate') && (
                  <div className="form-group">
                    <label htmlFor="eventStartDate">Start Date</label>
                    <input
                      type="text"
                      id="eventStartDate"
                      name="eventStartDate"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
                {step.fields.includes('eventEndDate') && (
                  <div className="form-group">
                    <label htmlFor="eventEndDate">End Date</label>
                    <input
                      type="text"
                      id="eventEndDate"
                      name="eventEndDate"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
                {step.fields.includes('eventAddress') && (
                  <div className="form-group">
                    <label htmlFor="eventAddress">Event Address</label>
                    <input
                      type="text"
                      id="eventAddress"
                      name="eventAddress"
                      placeholder="Event address"
                      onChange={handleInputChange}
                      value={form.eventAddress}
                      required
                    />
                  </div>
                )}
                {step.fields.includes('maxAttendees') && (
                  <div className="form-group">
                    <label htmlFor="maxAttendees">Max Attendees</label>
                    <input
                      type="number"
                      id="maxAttendees"
                      name="maxAttendees"
                      placeholder="Max attendees"
                      onChange={handleInputChange}
                      value={form.maxAttendees}
                      required
                    />
                  </div>
                )}
                {step.fields.includes('eventPrice') && (
                  <div className="form-group">
                    <label htmlFor="eventPrice">Event Price</label>
                    <input
                      type="text"
                      id="eventPrice"
                      name="eventPrice"
                      placeholder="Event price"
                      onChange={handleInputChange}
                      value={form.eventPrice}
                      required
                    />
                  </div>
                )}
                {step.fields.includes('photo') && (
                  <div className="form-group">
                    <label htmlFor="photoURL">Photo</label>
                    <input
                      type="file"
                      id="photoURL"
                      name="photo"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
                <div className="button-group">
                  {index > 0 && (
                    <button type="button" className="prev-btn" onClick={prevStep} aria-label="Previous Step">
                      Previous
                    </button>
                  )}
                  {index < formSteps.length - 1 && (
                    <button type="button" className="next-btn" onClick={nextStep} aria-label="Next Step">
                      Next
                    </button>
                  )}
                  {index === formSteps.length - 1 && (
                    <button type="submit" className="create-event-btn" aria-label="Create Event">
                      Create Event
                    </button>
                  )}
                </div>
              </div>
            ))}
          </form>
        </>
      ) : (
        <div className="qr-section">
          <h2>Event Created Successfully!</h2>
          <div ref={posterRef} className="poster-container">
            <div className="poster-background"></div> {/* Use CSS background */}
            <div className="qr-code-container">
              <QRCodeCanvas value={eventID} size={160} includeMargin={true} />
            </div>
          </div>
          <button className="download-poster-btn" onClick={downloadPoster}>
            Download Poster
          </button>
          <button 
            className="back-to-dashboard-btn" 
            onClick={() => window.location.href = '/dashboard'}
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default EventForm;

"use client"


import { useState, useEffect, useRef } from "react";

const Alarm = () => {
  const [alarmTime, setAlarmTime] = useState("");
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const alarmTimeout = useRef(null);
  const alarmSoundRef = useRef(null);

  // Handle setting the alarm
  const handleSetAlarm = (e) => {
    e.preventDefault();
    if (alarmTime) {
      const [alarmHour, alarmMinute] = alarmTime.split(":");
      const now = new Date();
      const alarmDate = new Date();
      alarmDate.setHours(alarmHour, alarmMinute, 0, 0);

      // If alarm time is in the past, set it for the next day
      if (alarmDate <= now) {
        alarmDate.setDate(alarmDate.getDate() + 1);
      }

      const timeToAlarm = alarmDate - now;

      // Clear any existing alarm
      if (alarmTimeout.current) {
        clearTimeout(alarmTimeout.current);
      }

      // Set a timeout for the alarm
      alarmTimeout.current = setTimeout(() => {
        playAlarm();
        alert("It's time! Your alarm is ringing!");
        setIsAlarmSet(false);
      }, timeToAlarm);

      alert(`Your alarm has been set for ${alarmDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      setIsAlarmSet(true);
    }
  };

  // Function to play the alarm sound
  const playAlarm = () => {
    alarmSoundRef.current = new Audio("./alarm.mp3.wav"); // Ensure alarm-tone.mp3 is in the public folder
    alarmSoundRef.current.loop = true; // Loop the alarm sound
    alarmSoundRef.current.play();
  };

  // Function to stop the alarm sound
  const stopAlarm = () => {
    if (alarmSoundRef.current) {
      alarmSoundRef.current.pause();
      alarmSoundRef.current.currentTime = 0;
    }
  };

  // Handle canceling the alarm
  const handleCancelAlarm = () => {
    if (alarmTimeout.current) {
      clearTimeout(alarmTimeout.current);
      alarmTimeout.current = null;
    }
    stopAlarm();
    setIsAlarmSet(false);
    setAlarmTime("");
    alert("Alarm has been canceled.");
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (alarmTimeout.current) {
        clearTimeout(alarmTimeout.current);
      }
      stopAlarm();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-black">Set Your Alarm</h1>
      <form onSubmit={handleSetAlarm} className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <label className="block mb-4 text-lg text-gray-700">Set Alarm Time:</label>
        <input
          type="time"
          className="block w-full p-2 border border-gray-300 rounded-lg mb-4 text-gray-700"
          value={alarmTime}
          onChange={(e) => setAlarmTime(e.target.value)}
          required
        />
        <div className="flex space-x-4">
          {!isAlarmSet ? (
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
            >
              Set Alarm
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancelAlarm}
              className="flex-1 py-2 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-300"
            >
              Cancel Alarm
            </button>
          )}
        </div>
      </form>
      {isAlarmSet && (
        <div className="mt-4 text-gray-600">
          <p>Alarm is set for: <span className="font-semibold">{new Date(new Date().setHours(...alarmTime.split(":"))).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
        </div>
      )}
    </div>
  );
};

export default Alarm;



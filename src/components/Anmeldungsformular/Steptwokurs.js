import React, { useState, useEffect } from 'react';

function Step2({ season, onCourseSelect }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [season]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`http://localhost:5000/kurse/${season.saison_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      console.log('Fetched courses:', data);

      // Formatierung des Datums für den Kursstart
      const formattedCourses = data.map(course => ({
        ...course,
        kurs_start: new Date(course.kurs_start).toLocaleDateString('de-DE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }));
      setCourses(formattedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCourse) {
      const courseObject = JSON.parse(selectedCourse);
      console.log('Selected course:', courseObject);
      onCourseSelect(courseObject);
    } else {
      alert("Bitte einen Kurs auswählen.");
    }
  };

  return (
    <form id="profil" onSubmit={handleSubmit}>
      <h2>Anmeldung Hundeschule</h2>
      <div>
        <label>Kurs auswählen</label>
        <select
          name="kurs_id"
          value={selectedCourse}
          onChange={(e) => {
            console.log("Course Changed", e.target.value);
            setSelectedCourse(e.target.value);
          }}
        >
          <option value="">Kurs auswählen</option>
          {courses.map((course) => (
            <option key={course.kurs_id} value={JSON.stringify({ kurs_id: course.kurs_id, kurs_name: course.kurs_name })}>
              {course.kurs_name} Kurs Start: {course.kurs_start}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Weiter</button>
    </form>
  );
}

export default Step2;

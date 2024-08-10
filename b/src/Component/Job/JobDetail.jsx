import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../index.js';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null); // Use `null` instead of `{}` for uninitialized state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to handle errors
  const navigateTo = useNavigate();
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    if (!id) {
      setError('Job ID is missing.');
      setLoading(false);
      return;
    }

    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/job/getall/${id}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setJob(response.data.job);
        } else {
          setError('Job not found.');
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Unauthorized access.');
        } else {
          setError('Error fetching job details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    if (!loading) {
      if (error) {
        navigateTo('/notfound');
      } else if (!isAuthorized) {
        navigateTo('/login');
      }
    }
  }, [loading, error, isAuthorized, navigateTo]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!job) {
    return <p>No job details available.</p>;
  }

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>
            Title: <span>{job.position}</span>
          </p>
          <p>
            Category: <span>{job.company}</span>
          </p>
          <p>
            Country: <span>{job.country}</span>
          </p>
          <p>
            City: <span>{job.city}</span>
          </p>
          <p>
            Location: <span>{job.location}</span>
          </p>
          <p>
            Description: <span>{job.description}</span>
          </p>
          <p>
            Job Posted On: <span>{job.createdBy}</span>
          </p>
          <p>
            Salary:{" "}
            {job.fixedSalary ? (
              <span>{job.fixedSalary}</span>
            ) : (
              <span>
                {job.salaryFrom} - {job.salaryTo}
              </span>
            )}
          </p>
          {user && user.role !== 'Job seeker' ? (
            <Link to={`/application/${job._id}`}>Apply Now</Link>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;

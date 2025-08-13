import { useState, useEffect, useContext } from 'react';
import styles from '../components/styles/ProjectList.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../AppContext';

const ProjectsList = () => {
    const navigate = useNavigate();
    const { user } = useContext(AppContext);

    useEffect(() => {
        const checkLoginStatus = () => {
            if (!user) {
                navigate('/login');
                return null; // Prevent rendering the login page if user is already logged in
            }
        }

        checkLoginStatus();
    }, []);

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_LOCAL_BACKEND_URL}/project`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (data.status === 'success') {
                    setProjects(data.data);
                } else {
                    setError('Failed to fetch projects');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getProjectImage = (projectImage) => {
        switch (projectImage) {
            case 'node':
                return (
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg"
                        alt="Node.js logo"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentElement.querySelector('.fallbackIcon').style.display = 'flex';
                        }}
                    />
                );
            default:
                return (
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2965/2965300.png"
                        alt="Default project icon"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentElement.querySelector('.fallbackIcon').style.display = 'flex';
                        }}
                    />
                );
        }
    };

    const handleOpenProject = (project) => {
        navigate(`/project/${project.project_id}`);
    }

    if (loading) {
        return <div className="loader_container"><div className="loader"></div></div>;
    }

    return (
        <>
            <Navbar />
            <div className={styles.projectsContainer}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Your Projects</h1>
                        <p className={styles.subtitle}>Manage and organize your work</p>
                    </div>
                    <button className={styles.createButton}>+ New Project</button>
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading projects...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <div className={styles.projectsGrid}>
                        {projects.map((project) => (
                            <div key={project.project_id} className={styles.projectCard}>
                                <div className={styles.projectImage}>
                                    {getProjectImage(project.project_image)}
                                </div>
                                <div className={styles.projectContent}>
                                    <h3 className={styles.projectName}>{project.project_name}</h3>
                                    <p className={styles.projectDescription}>
                                        {project.project_description}
                                    </p>
                                    <div className={styles.projectActions}>
                                        <span>Project ID: {project.project_id}</span>
                                        <button className={styles.projectButton} onClick={() => handleOpenProject(project)}>Open</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ProjectsList;
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AppContext } from '../AppContext';
import { useNavigate } from "react-router-dom";
import ProjectModal from "../components/ProjectModal";
import { useState, useEffect, useContext } from 'react';
import styles from '../components/styles/ProjectList.module.css';

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

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Projects from backend
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
        const logos = {
            react: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
            node: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
            flask: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Flask_logo.svg",
            python: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
        };

        const src = logos[projectImage] || "https://cdn-icons-png.flaticon.com/512/2965/2965300.png";

        return (
            <img
                src={src}
                alt={`${projectImage} logo`}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                    e.target.parentElement.querySelector('.fallbackIcon').style.display = 'flex';
                }}
            />
        );
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
                    {/* <button className={styles.createButton}>+ New Project</button> */}
                    <button className={styles.createButton} onClick={() => setIsModalOpen(true)}>
                        + New Project
                    </button>

                    <ProjectModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading projects...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : projects.length === 0 ? (
                    <div className={styles.noProjects}>
                        <p>No projects found. Create your first project!</p>
                    </div>
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
                                        <button
                                            className={styles.projectButton}
                                            onClick={() => handleOpenProject(project)}
                                        >
                                            Open
                                        </button>
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
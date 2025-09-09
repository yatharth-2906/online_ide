import { useRef, useState } from "react";
import styles from "./styles/ProjectModal.module.css";

const ProjectModal = ({ isOpen, onClose }) => {
    const projectNameRef = useRef();
    const projectDescriptionRef = useRef();
    const [selectedTech, setSelectedTech] = useState("");

    const techOptions = [
        { value: "react", label: "React.js", icon: "fab fa-react" },
        { value: "node", label: "Node.js", icon: "fab fa-node-js" },
        { value: "flask", label: "Flask", icon: "fab fa-python" },
        { value: "python", label: "Python", icon: "fab fa-python" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const project_name = projectNameRef.current.value.trim();
            const project_description = projectDescriptionRef.current.value.trim();
            const image = selectedTech;

            const response = await fetch(`${import.meta.env.VITE_LOCAL_BACKEND_URL}/project/create`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({project_name, project_description, image})
            });

            const data = await response.json();
            if (data.status === "success") {
                console.log("Project created successfully:", data);
                window.location.reload();
            }
        } catch (err) {
            console.error("Error creating project:", err);
        }
    };

    const handleClose = () => {
        // Reset form on close
        projectNameRef.current.value = "";
        projectDescriptionRef.current.value = "";
        setSelectedTech("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Create New Project</h2>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={handleClose}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            Project Name *
                        </label>
                        <input
                            ref={projectNameRef}
                            type="text"
                            required
                            className={styles.formInput}
                            placeholder="Enter project name"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            Project Description
                        </label>
                        <textarea
                            ref={projectDescriptionRef}
                            className={styles.formTextarea}
                            placeholder="Describe your project"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            Technology Stack
                        </label>
                        <div className={styles.techOptions}>
                            {techOptions.map(tech => (
                                <div
                                    key={tech.value}
                                    className={`${styles.techOption} ${selectedTech === tech.value ? styles.selected : ''}`}
                                    onClick={() => setSelectedTech(tech.value)}
                                >
                                    <i className={tech.icon}></i>
                                    <span>{tech.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className={styles.createButton}>
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
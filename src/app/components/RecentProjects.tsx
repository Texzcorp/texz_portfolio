import { recentProjects } from '@/app/resources/portfolio';
import styles from './PortfolioUpdates.module.scss';

export function RecentProjects() {
    return (
        <section className={styles.section} aria-labelledby="recent-projects">
            <p className={styles.eyebrow}>Software & games</p>
            <h2 id="recent-projects">Recent and ongoing projects</h2>
            <div className={styles.grid}>
                {recentProjects.map(project => (
                    <article key={project.name} className={styles.project}>
                        <p className={styles.eyebrow}>{project.category}</p>
                        <h3>{project.name}</h3>
                        <span className={styles.status}>{project.status}</span>
                        <p>{project.description}</p>
                        <p className={styles.note}>My role: {project.role}.</p>
                        {project.url && (
                            <div className={styles.projectLinks}>
                                <a href={project.url} target="_blank" rel="noopener noreferrer">{project.linkLabel} ↗</a>
                                {'demoUrl' in project && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">Public demo ↗</a>}
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
}

import { compositionContact } from '@/app/resources/portfolio';
import styles from './PortfolioUpdates.module.scss';

export function CompositionOffer() {
    return (
        <section className={styles.offer} aria-labelledby="composition-offer">
            <p className={styles.eyebrow}>Original music · film / advertising / games</p>
            <h2 id="composition-offer">A piece built around your brief.</h2>
            <p>Creation from €4,500 excl. VAT. A 30–60 second composition, two shorter versions and stems, with two rounds of consolidated feedback. Usage rights are quoted separately.</p>
            <p className={styles.note}>Projects scoped to a maximum of five working days. The schedule is agreed after the brief, quote, picture or reference material, and feedback timings are confirmed.</p>
            <div className={styles.actions}>
                <a className={styles.action} href={compositionContact}>Discuss a music brief →</a>
            </div>
            <p className={styles.note}>Send the intended use, picture or references, deadline and budget.</p>
        </section>
    );
}

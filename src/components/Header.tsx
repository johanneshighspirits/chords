import styles from './Header.module.css';
import { Container } from './layout/PageContainer';

export const Header = () => (
  <header className={styles.Header}>
    <Container>
      <h1>Chords</h1>
    </Container>
  </header>
);

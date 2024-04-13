import styles from './Header.module.css';
import { SignOut } from './auth/SignOut';
import { Container } from './layout/PageContainer';

export const Header = () => (
  <header className={styles.Header}>
    <Container className={styles.Container}>
      <h1>Chords</h1>
      <SignOut />
    </Container>
  </header>
);

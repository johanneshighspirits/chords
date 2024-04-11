import styles from './Header.module.css';
import { SignIn } from './auth/SignIn';
import { Container } from './layout/PageContainer';

export const Header = () => (
  <header className={styles.Header}>
    <Container>
      <h1>Chords</h1>
      <SignIn />
    </Container>
  </header>
);

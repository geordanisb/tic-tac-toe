import { FunctionComponent } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SimpleLayout: FunctionComponent = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;


  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>
        <Link href="#">
        <a>TIC TAC TOE</a>
        </Link>
      </Navbar.Brand>
    
  </Navbar>
  );
};

export default SimpleLayout;

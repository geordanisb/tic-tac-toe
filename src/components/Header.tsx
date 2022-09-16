import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Form, FormControl, Nav, Navbar } from 'react-bootstrap';

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;



  let right = null;

    right = (
      <div className="right">
        <Link href="/api/auth/signin">
          <a data-active={isActive('/signup')}>Log in</a>
        </Link>
        <style jsx>{`
          a {
            text-decoration: none;
            color: #000;
            display: inline-block;
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right a {
            border: 1px solid black;
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }
        `}</style>
      </div>
    );
  // }
 
  
  return (
   <> 
    <Navbar bg="light" variant="light">
    <Navbar.Brand href="#home">TIC TAC TOE-APP</Navbar.Brand>
    <Nav className="mr-auto">
          <Nav.Item style={{marginRight:'1em'}}>            
          <Link href="/">
          <a className="bold" data-active={isActive('/')}>
            Home
          </a>
        </Link>
      </Nav.Item>
          
          
        </Nav>
        
  </Navbar></>
  );
};

export default Header;
import { FunctionComponent } from 'react';
import {Container} from 'react-bootstrap';

import Header from '../Header';

type Props = {
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const SimpleLayout: FunctionComponent<Props> = ({ children, title }) => {
  

  return (
    <>
      {/* <Navbar /> */}
      <Header />
      
      <Container className="mt-5">
      <h2>{ title}</h2>
        {children}
        
      </Container>
       
    </>
  );
};

export default SimpleLayout;

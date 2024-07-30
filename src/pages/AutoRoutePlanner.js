import React, { useState } from 'react';
import RouteCriteria from '../components/RouteCriteria';
import './AutoRoutePlanner.css';

const AutoRoutePlanner = () => {
  const [address, setAddress] = useState('');

  return (
    <div className="auto-route-planner">
      <RouteCriteria />
    </div>
  );
};

export default AutoRoutePlanner;

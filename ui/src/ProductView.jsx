import React from 'react';

export default function ProductView({ match }) {
  const { id } = match.params;
 
  
        return (
	     <fragment>
		  <h2>{ `displaying the image ${id}` } </h2>
          
		  </fragment> 
        );

	
  
}
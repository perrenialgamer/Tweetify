import React from 'react'
import './cardForLandingPageCss.css'

const cardForLandingPage = ({title, desc}) => {
  return (
    <div>
      <div className="card">
    <div className="align">
        <span className="red"></span>
        <span className="yellow"></span>
        <span className="green"></span>
    </div>

    <h1>{title}</h1>
    <p>
        {desc}
    </p>
</div>
    </div>
  )
}

export default cardForLandingPage

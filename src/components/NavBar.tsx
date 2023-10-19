import { NavLink } from 'react-router-dom'

export default function NavBar() {
  return (
    <div className="fixed left-0 flex justify-center w-screen pointer-events-none bottom-5">
      <div className="pointer-events-auto nav">
        <NavLink to="/day">
          <span>D</span>
          <p>Day</p>
        </NavLink>
        <NavLink to="/week">
          <span>W</span>
          <p>Week</p>
        </NavLink>
        <NavLink to="/year">
          <span>Y</span>
          <p>Year</p>
        </NavLink>
        <span className="active-bg"></span>
      </div>
    </div>
  )
}

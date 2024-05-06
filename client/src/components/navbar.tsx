import { Link } from '@tanstack/react-router'

export default function Navbar() {
  return (
    <nav>
      <ul className="flex gap-2 p-2 font-geist">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/expenses" className="[&.active]:font-bold">
          Expenses
        </Link>
      </ul>
    </nav>
  )
}

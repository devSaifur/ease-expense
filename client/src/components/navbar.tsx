import { Link } from '@tanstack/react-router'

export default function Navbar() {
  return (
    <nav>
      <ul className="mx-auto flex justify-center gap-6 py-6 font-geist">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/expenses" className="[&.active]:font-bold">
          Expenses
        </Link>
        <Link to="/expenses/new" className="[&.active]:font-bold">
          Create Expense
        </Link>
        <Link to="/sign-in" className="[&.active]:font-bold">
          Sign In
        </Link>
        <Link to="/sign-up" className="[&.active]:font-bold">
          Sign Up
        </Link>
      </ul>
    </nav>
  )
}

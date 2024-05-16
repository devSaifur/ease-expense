import { userQueryOptions } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

export default function Navbar() {
  const { data: user } = useQuery(userQueryOptions)

  return (
    <nav className="sticky top-0 flex items-center justify-between px-60 backdrop-blur-lg">
      <Link to="/" className="text-2xl [&.active]:font-bold">
        Expense Tracker
      </Link>
      <ul className="flex items-center gap-6 py-6 text-lg">
        {user ? (
          <>
            <Link to="/expenses" className="[&.active]:font-bold">
              Expenses
            </Link>
            <Link to="/profile" className="[&.active]:font-bold">
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link to="/sign-in" className="[&.active]:font-bold">
              Sign In
            </Link>
            <Link to="/sign-up" className="[&.active]:font-bold">
              Sign Up
            </Link>
          </>
        )}
      </ul>
    </nav>
  )
}

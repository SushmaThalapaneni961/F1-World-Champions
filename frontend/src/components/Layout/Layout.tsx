import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-lg font-semibold">Home</Link>
            </li>
            <li>
              <Link to="/seasons" className="text-lg font-semibold">Seasons</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow p-4">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <p className="text-center">© 2024 Formula Racing</p>
      </footer>
    </div>
  );
}

export default Layout;
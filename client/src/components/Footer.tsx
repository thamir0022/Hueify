import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='border-t w-full mt-auto h-20 py-20 flex flex-col gap-2 items-center justify-center'>
      <Link to={"/"} className='text-3xl font-semibold'>Hueify</Link>
      <p>Copyright© {new Date().getFullYear()} All Rights Reserved</p>
      <nav className='flex gap-4'>
        <Link className='hover:underline transition-all' to={"/"}>Home</Link>
        <Link className='hover:underline transition-all' to={"/menu"}>Menu</Link>
        <Link className='hover:underline transition-all' to={"/colors"}>Colors</Link>
        <Link className='hover:underline transition-all' to={"/sign-in"}>Sign In</Link>
      </nav>
    </footer>
  )
}

export default Footer
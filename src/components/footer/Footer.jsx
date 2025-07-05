import React from 'react';
import Brand from '../brand/Brand';

const Footer = () => {
  return false;
  return (
    <footer className="bg-zinc-900 text-zinc-300 border-t pt-20 border-zinc-700 pb-5">
      <div className="container flex justify-around">
        {/* Brand & Newsletter */}
        <div className="space-y-4">
          <Brand/>
        </div>

        {/* Practice */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Practice</h3>
          <ul className="space-y-2">
            <li><a href="#get-started" className="hover:underline text-gray-400">Data Structures and Algorithm Problem</a></li>
            <li><a href="#get-started" className="hover:underline text-gray-400">UI Problems</a></li>
            <li><a href="#get-started" className="hover:underline text-gray-400">System Design Problems</a></li>
          </ul>
        </div>

        {/* Guides */}
        {/* <div>
          <h3 className="text-xl font-semibold mb-2">Guides</h3>
          <ul className="space-y-2">
            <li><a href="#front-end-interview-playbook" className="hover:underline text-gray-400">Front End Interview Playbook</a></li>
            <li><a href="#front-end-system-design-playbook" className="hover:underline text-gray-400">Front End System Design Playbook</a></li>
            <li><a href="#react-interview-playbook" className="hover:underline text-gray-400">React Interview Playbook</a></li>
            <li><a href="#behavioral-interview-playbook" className="hover:underline text-gray-400">Behavioral Interview Playbook</a></li>
          </ul>
        </div> */}

        {/* Study Plans */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Study Plans</h3>
          <ul className="space-y-2">
            <li><a href="#1-week-plan" className="hover:underline text-gray-400">1 Week Plan</a></li>
            <li><a href="#1-month-plan" className="hover:underline text-gray-400">1 Month Plan</a></li>
            <li><a href="#3-months-plan" className="hover:underline text-gray-400">3 Months Plan</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Company</h3>
          <ul className="space-y-2">
            <li><a href="#about" className="hover:underline text-gray-400">About</a></li>
            <li><a href="#contact-us" className="hover:underline text-gray-400">Contact us</a></li>
            <li><a href="#blog" className="hover:underline text-gray-400">Blog</a></li>
          </ul>
        </div>
      </div>

      {/* Social Media & Language Selector */}
      {/* <div className="mt-8 flex justify-between items-center">
        <div className="flex space-x-4">
          <a href="#linkedin" className="text-white hover:text-gray-300"><i className="fab fa-linkedin"></i></a>
          <a href="#discord" className="text-white hover:text-gray-300"><i className="fab fa-discord"></i></a>
          <a href="#twitter" className="text-white hover:text-gray-300"><i className="fab fa-twitter"></i></a>
        </div>
        <select className="bg-gray-800 text-white px-4 py-2 rounded">
          <option value="english-us">English (US)</option>
          <option value="english-gb">English (GB)</option>
          <option value="spanish">Spanish</option>
        </select>
      </div> */}

      {/* Copyright & Footer Links */}
      <div className="mt-36 text-center space-y-2">
        <p>©2025 YourJsCoach. All rights reserved.</p>
        <ul className="flex justify-center space-x-4">
          {/* <li><a href="#privacy-policy" className="hover:underline text-gray-400">Privacy Policy</a></li>
          <li><a href="#terms-of-service" className="hover:underline text-gray-400">Terms of Service</a></li> */}
          <li>Made with <span className='text-red-500'>❤</span> in India</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
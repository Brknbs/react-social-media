import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react'

const Navbar = () => {
    const pathname = window.location.pathname;
    const path = pathname === '/' ? 'home' : pathname.substr(1);
    const [activeItem, setActiveItem] = useState(path);

    const handleItemClick = (e, { name }) => setActiveItem(name);

    return (
        <Menu pointing secondary fluid size='massive' color='purple' className='navbar'>
            <Menu.Item
                name='home'
                active={activeItem === 'home'}
                onClick={handleItemClick}
                as={Link}
                to='/'
            />
            <Menu.Menu position='right'>
                <Menu.Item
                    name='login'
                    active={activeItem === 'login'}
                    onClick={handleItemClick}
                    as={Link}
                    to='/login'
                />
                <Menu.Item
                    name='register'
                    active={activeItem === 'register'}
                    onClick={handleItemClick}
                    as={Link}
                    to='/register'
                />
                <Menu.Item
                    name='logout'
                    active={activeItem === 'logout'}
                    onClick={handleItemClick}
                    as={Link}
                    to='/'
                />
            </Menu.Menu>
        </Menu>
    )
}

export default Navbar;
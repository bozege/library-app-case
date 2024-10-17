import React from 'react';
import './App.css';
import { Tab, Tabs } from 'react-bootstrap';
import AllUsers from './AllUsers';
import AllBooks from './AllBooks';
import Header from './Header';

function HomePage() {
    return (
        <>
            <Header title={"Welcome!"} description={"World of Books"} />
            <Tabs
                defaultActiveKey="users" // Match to eventKey for clarity
                id="justify-tab-example"
                className="mb-3"
                justify
            >
                <Tab eventKey="users" title="Users">
                    <AllUsers />
                </Tab>
                <Tab eventKey="books" title="Books">
                    <AllBooks />
                </Tab>
            </Tabs>
        </>
    );
}

export default HomePage;

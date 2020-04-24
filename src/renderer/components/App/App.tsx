import React from 'react';
import { EditorCore } from '../EditorCore';
import { Sidebar } from '../Sidebar';

export const App = (): JSX.Element => {
    return (
        <div className="App">
            <Sidebar/>
            <EditorCore/>
        </div>
    )
}
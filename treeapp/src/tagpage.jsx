import 'react-sortable-tree/style.css';
import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
//import data from './dataset.csv'

export default class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [
        { title: 'Chicken', children: [{ title: 'Egg' }] },
        { title: 'Fish', children: [{ title: 'fingerline' }, { title: 'frenzy' }] },
        { title: 'frenzy', children: [{ title: 'finger' }] }
      ],
    };
  }

  render() {
    return (
      <div style={{ height: 400 }} >
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
        />
      </div >
    );
  }
}
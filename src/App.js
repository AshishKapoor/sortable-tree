import React, { Component } from "react";
import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
} from "@nosferatu500/react-sortable-tree";
import "@nosferatu500/react-sortable-tree/style.css"; // This only needs to be imported once in your app
import FileExplorerTheme from "react-sortable-tree-theme-file-explorer";
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [
        {
          title: "First node",
          expanded: true,
          children: [
            {
              title: "First child node",
              expanded: true,
              children: [
                {
                  title: <div>Going down further</div>,
                },
              ],
            },
          ],
        },
        {
          title: "Second node",
          expanded: true,
          children: [
            {
              title: "Second child node",
              expanded: true,
              children: [
                {
                  title: <div>Second node child 1</div>,
                },
                {
                  title: <div>Second node child 2</div>,
                },
              ],
            },
          ],
        },
        {
          title: <div>Another parent node</div>,
        },
      ],
      nodeClicked: false,
    };
  }

  handleTreeOnChange = (treeData) => {
    this.setState({ treeData });
  };

  handleNodeClick = (node) => {
    this.setState({
      nodeClicked: node,
    });
  };

  render() {
    const nodeEntities = ["Plant", "Area", "Line", "Unit"];
    const { nodeClicked } = this.state;
    const getNodeKey = ({ treeIndex }) => treeIndex;
    const getNodeEntities = () =>
      nodeEntities[Math.floor(Math.random() * nodeEntities.length)];
    return (
      <div style={{ display: "flex", flexDirection: "row", margin: "16px" }}>
        <div style={{ height: "100vh", width: "20%", overflow: "scroll" }}>
          <SortableTree
            style={{
              paddingTop: "20px",
              padding: "16px",
              borderRadius: "16px 16px 0 0",
              backgroundColor: "#ebecf0",
            }}
            theme={FileExplorerTheme}
            getNodeKey={getNodeKey}
            generateNodeProps={(rowInfo) => {
              const { node, path } = rowInfo;
              return {
                buttons: [
                  <button
                    onClick={() =>
                      this.setState((state) => ({
                        treeData: addNodeUnderParent({
                          treeData: state.treeData,
                          parentKey: path[path.length - 1],
                          expandParent: true,
                          getNodeKey,
                          newNode: {
                            title: getNodeEntities(),
                          },
                          addAsFirstChild: state.addAsFirstChild,
                        }).treeData,
                      }))
                    }
                  >
                    +
                  </button>,
                  <button
                    onClick={() =>
                      this.setState((state) => ({
                        treeData: removeNodeAtPath({
                          treeData: state.treeData,
                          path,
                          getNodeKey,
                        }),
                      }))
                    }
                  >
                    -
                  </button>,
                ],
                onClick: () => {
                  this.handleNodeClick(node);
                },
                style: node === this.state.nodeClicked && {
                  border: "2px dashed black",
                  padding: "4px",
                  borderRadius: "8px",
                },
              };
            }}
            treeData={this.state.treeData}
            onChange={this.handleTreeOnChange}
            canDrag={() => false}
            canDrop={() => false}
          />
        </div>
        <div
          style={{
            height: "100vh",
            width: "70%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {nodeClicked && (
            <p>
              <b>{nodeClicked.title}</b>{" "}
              <pre>{JSON.stringify(nodeClicked, null, 2)}</pre>
            </p>
          )}
        </div>
      </div>
    );
  }
}

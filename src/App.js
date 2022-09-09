import React, { Component } from "react";
import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
} from "@nosferatu500/react-sortable-tree";
import "@nosferatu500/react-sortable-tree/style.css"; // This only needs to be imported once in your app
import FileExplorerTheme from "react-sortable-tree-theme-file-explorer";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchString: "",
      searchFocusIndex: 0,
      searchFoundCount: null,
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
          title: <div>Some node</div>,
          expanded: true,
          children: [
            {
              title: "Third child node",
              expanded: true,
              children: [
                {
                  title: <div>Third node child 1</div>,
                },
                {
                  title: <div>Third node child 2</div>,
                },
              ],
            },
          ],
        },
        {
          title: <div>4th node</div>,
          expanded: true,
          children: [
            {
              title: "4th child node",
              expanded: true,
              children: [
                {
                  title: <div>4th node child 1</div>,
                },
                {
                  title: <div>4th node child 2</div>,
                },
              ],
            },
          ],
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
    const { nodeClicked, searchString, searchFocusIndex, searchFoundCount } =
    this.state;
    console.log('searchString, searchFocusIndex, searchFoundCount: ', searchString, searchFocusIndex, searchFoundCount);
    const getNodeKey = ({ treeIndex }) => treeIndex;
    const getNodeEntities = () =>
      nodeEntities[Math.floor(Math.random() * nodeEntities.length)];

    // Case insensitive search of `node.title`
    const customSearchMethod = ({ node, searchQuery }) => {
      console.log('node: ', searchQuery && typeof node.title === 'string' && node.title.toLowerCase().includes(searchQuery.toLowerCase()));
      return searchQuery && typeof node.title === 'string' && node.title.toLowerCase().includes(searchQuery.toLowerCase());
    };

    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1,
      });

    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFocusIndex + 1) % searchFoundCount
            : 0,
      });

    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "row",
          margin: "16px",
        }}
      >
        <div style={{ width: "28%", overflow: "scroll" }}>
          <h2>Node Demo</h2>
          <form
            style={{ display: "inline-block" }}
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <input
              id="find-box"
              type="text"
              placeholder="Search..."
              style={{ fontSize: "1rem" }}
              value={searchString}
              onChange={(event) =>
                this.setState({ searchString: event.target.value })
              }
            />

            <button
              type="button"
              disabled={!searchFoundCount}
              onClick={selectPrevMatch}
            >
              &lt;
            </button>

            <button
              type="submit"
              disabled={!searchFoundCount}
              onClick={selectNextMatch}
            >
              &gt;
            </button>

            <span>
              &nbsp;
              {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
              &nbsp;/&nbsp;
              {searchFoundCount || 0}
            </span>
          </form>
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
            //
            // Custom comparison for matching during search.
            // This is optional, and defaults to a case sensitive search of
            // the title and subtitle values.
            // see `defaultSearchMethod` in https://github.com/frontend-collective/react-sortable-tree/blob/master/src/utils/default-handlers.js
            searchMethod={customSearchMethod}
            //
            // The query string used in the search. This is required for searching.
            searchQuery={searchString}
            //
            // When matches are found, this property lets you highlight a specific
            // match and scroll to it. This is optional.
            searchFocusOffset={searchFocusIndex}
            //
            // This callback returns the matches from the search,
            // including their `node`s, `treeIndex`es, and `path`s
            // Here I just use it to note how many matches were found.
            // This is optional, but without it, the only thing searches
            // do natively is outline the matching nodes.
            searchFinishCallback={(matches) =>
              this.setState({
                searchFoundCount: matches.length,
                searchFocusIndex:
                  matches.length > 0 ? searchFocusIndex % matches.length : 0,
              })
            }
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
              <pre
                style={{
                  width: "800px",
                  maxHeight: "800px",
                  overflow: "scroll",
                  backgroundColor: "#ebecf0",
                }}
              >
                {JSON.stringify(nodeClicked, null, 2)}
              </pre>
            </p>
          )}
        </div>
      </div>
    );
  }
}

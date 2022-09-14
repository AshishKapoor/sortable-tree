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
                  title: <div>Second node down 1</div>,
                },
                {
                  title: <div>Second node down 2</div>,
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
              title: "Third down node",
              expanded: true,
              children: [
                {
                  title: <div>Third node down 1</div>,
                },
                {
                  title: <div>Third node down 2</div>,
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
              title: "4th down node",
              expanded: true,
              children: [
                {
                  title: <div>4th node down 1</div>,
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
    const nodeEntities = ["A Node", "B Node", "C Node", "D Node"];
    const { nodeClicked, searchString, searchFocusIndex, searchFoundCount } =
      this.state;
    const getNodeKey = ({ treeIndex }) => treeIndex;
    const getNodeEntities = () =>
      nodeEntities[Math.floor(Math.random() * nodeEntities.length)];

    // Case insensitive search of `node.title`
    const customSearchMethod = ({ node, searchQuery }) =>
      searchQuery &&
      typeof node.title === "string" &&
      node.title.toLowerCase().includes(searchQuery.toLowerCase());

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
        }}
      >
        <div style={{ width: "350px", minWidth: "350px", overflow: "scroll" }}>
          <div style={{ margin: "16px" }}>
            <h3>Node Structure</h3>
            <form
              style={{ display: "inline-block" }}
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <input
                id="find-box"
                type="text"
                placeholder="Search asset node"
                style={{ fontSize: "1rem", marginBottom: "24px" }}
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

              <button
                style={{
                  marginRight: "8px",
                }}
                onClick={() =>
                  this.setState((state) => ({
                    treeData: state.treeData.concat({
                      title: getNodeEntities(),
                    }),
                  }))
                }
              >
                Add root node
              </button>
              <label htmlFor="addAsFirstChild">
                Add new nodes at start
                <input
                  name="addAsFirstChild"
                  type="checkbox"
                  checked={this.state.addAsFirstChild}
                  onChange={() =>
                    this.setState((state) => ({
                      addAsFirstChild: !state.addAsFirstChild,
                    }))
                  }
                />
              </label>
            </form>
          </div>

          <SortableTree
            style={{
              padding: "16px",
              borderRadius: "0 16px 0 0",
              backgroundColor: "#f3f3f6",
            }}
            theme={FileExplorerTheme}
            getNodeKey={getNodeKey}
            generateNodeProps={(rowInfo) => {
              const { node, path } = rowInfo;
              return {
                buttons: [
                  <button
                    data-toggle="tooltip"
                    delay='{"show": 100, "hide": 100}'
                    data-placement="top"
                    title="Click to add a child element here"
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
                    data-toggle="tooltip"
                    delay='{"show": 100, "hide": 100}'
                    data-placement="top"
                    title="Click to remove a child element here"
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
            canDrag={() => true}
            canDrop={() => true}
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
            width: "70%",
            alignItems: "flex-start",
            justifyContent: "center",
            marginLeft: "28px",
          }}
        >
          {nodeClicked && (
            <p>
              <h3>{nodeClicked.title}</h3>{" "}
              <pre
                style={{
                  width: "70vw",
                  maxHeight: "800px",
                  overflow: "auto",
                  borderRadius: "12px",
                  padding: "8px",
                  color: "white",
                  backgroundColor: "#000000",
                  fontFamily: "monospace",
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

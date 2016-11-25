/**
 * Created by ivan.datsiv on 11/15/2016.
 */

var Note = React.createClass({
    render: function () {

        var style = {backgroundColor: this.props.color};
        return (
            <div className="note" style={style}>
                <span className="delete-note" onClick={this.props.onDelete}> x </span>
                {this.props.children}
            </div>
        )
    }
});

var Color = React.createClass({

    localHandleClick: function () {
        this.props.localHandleClick(this.props.inColor);
    },

    render: function () {
        return (
            <div onClick={this.localHandleClick}>{this.props.activeColor}</div>
        )
    }
});

var Colors = React.createClass({
        getInitialState: function () {
            return {
                activeColor: ['+', '', '', '', ''],
                colorList: ["#d53eff", "#347fff", "#55ff58", "#ff5891", "#d69552"]
            }
        },

        componentWillUpdate: function () {
            var color = this.props.color;
            var activeColor = this.state.activeColor;
            this.state.colorList.forEach(function (e, i) {
                activeColor[i] = '';
                if (e === color) {
                    activeColor[i] = '+';
                }
            });
        },

        render: function () {
            return (
                <div className="colors">
                    <Color localHandleClick={this.props.localHandleClick} inColor={this.state.colorList[0]}
                           activeColor={this.state.activeColor[0]}></Color>
                    <Color localHandleClick={this.props.localHandleClick} inColor={this.state.colorList[1]}
                           activeColor={this.state.activeColor[1]}></Color>
                    <Color localHandleClick={this.props.localHandleClick} inColor={this.state.colorList[2]}
                           activeColor={this.state.activeColor[2]}></Color>
                    <Color localHandleClick={this.props.localHandleClick} inColor={this.state.colorList[3]}
                           activeColor={this.state.activeColor[3]}></Color>
                    <Color localHandleClick={this.props.localHandleClick} inColor={this.state.colorList[4]}
                           activeColor={this.state.activeColor[4]}></Color>
                </div>
            )
        }
    })
    ;

var NoteEditor = React.createClass({
    getInitialState: function () {
        return {
            text: '',
            color: '#d53eff',
        }
    },

    handleTextChange: function (event) {
        this.setState({text: event.target.value});
    },

    handleNoteColor: function (inColor) {
        this.setState({color: inColor});
    },

    handleNoteAdd: function () {
        var newNote = {
            text: this.state.text,
            color: this.state.color,
            id: Date.now()
        };

        this.props.onNoteAdd(newNote);
        this.setState({text: ''});
    },


    render: function () {
        return (
            <div className="note-editor">
                <textarea
                    placeholder="Enter your note here..."
                    row={5}
                    className="textarea"
                    value={this.state.text}
                    onChange={this.handleTextChange}/>

                <Colors localHandleClick={this.handleNoteColor} color={this.state.color}/>

                <button className="add-button" onClick={this.handleNoteAdd}>Add</button>
            </div>
        )
    }
});


var NotesGrid = React.createClass({
    componentDidMount: function () {
        var grid = this.refs.grid;
        this.msnry = new Masonry(grid, {
            itemSelector: '.note',
            columnWidth: 200,
            gutter: 10,
            isFitWidth: true
        });
    },

    componentDidUpdate: function (prevProps) {
        if (this.props.notes.length !== prevProps.notes.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

    render: function () {
        var onNoteDelete = this.props.onNoteDelete;
        return (

            <div className="notes-grid" ref="grid">
                {
                    this.props.notes.map(function (note) {
                        return (
                            <Note key={note.id}
                                  onDelete={onNoteDelete.bind(null, note)}
                                  color={note.color}>
                                {note.text}
                            </Note>
                        );
                    })
                }
            </div>
        )
    }
});

var NotesApp = React.createClass({
    getInitialState: function () {
        return {
            notes: []
        }
    },
    componentDidMount: function () {
        var localNotes = JSON.parse(localStorage.getItem('notes'));
        if (localNotes) {
            this.setState({notes: localNotes});
        }
    },

    componentDidUpdate: function () {
        this._updateLocalStorage();
    },

    handleNoteDelete: function (note) {
        var noteId = note.id;
        var newNotes = this.state.notes.filter(function (note) {
            return note.id !== noteId;
        });
        this.setState({notes: newNotes});
    },

    handleNoteAdd: function (newNote) {
        var newNotes = this.state.notes.slice();
        newNotes.unshift(newNote);
        this.setState({notes: newNotes});
    },

    render: function () {
        return (
            <div className="notes-app">
                <NoteEditor onNoteAdd={this.handleNoteAdd}/>
                <NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete}/>
            </div>
        )
    },

    _updateLocalStorage: function () {
        var notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    }
});

ReactDOM.render(
    <NotesApp />,
    document.getElementById('mount-point')
)
import React, { Component } from "react";
import { StyleSheet, FlatList, Text, View, TouchableOpacity, TextInput, Button, Dimensions, Keyboard, } from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome';

var screenwidth = Dimensions.get('window').width;

export default class ElemFltwo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            aletter: 'A',
            bletter: 'B',
            isLoading: false,
            dataItems: [],
            partword: ''
        };
    }

    _randomString = () => {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZ";
        var string_length = 1;
        var randomstr = '';
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstr += chars.substring(rnum, rnum + 1);
        }
        return randomstr;
    }

    _aLetterPress = () => {
        var newLetter = this._randomString();
        this.setState({ aletter: newLetter });
    };

    _bLetterPress = () => {
        var newLetter = this._randomString();
        this.setState({ bletter: newLetter });
    };

    componentDidMount() {
        this._aLetterPress();
        this._bLetterPress();
    }

    _hideSoftKeyboard = () => {
        Keyboard.dismiss();
    }

    _inputChange() {
        this.setState({ isLoading: true });
        this._hideSoftKeyboard();
        this.textInput.clear();
        this._fetchJsonData(this.state.partword);
    }

    async _fetchJsonData(myword) {
        //Retrieve remote JSON data
        var jUrl = 'https://api.datamuse.com/words?sp=';
        if (myword) {
            jUrl = jUrl + myword + '*&max=5';
        } else {
            jUrl = jUrl + 'a*&max=10';
        }

        return fetch(jUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataItems: responseJson
                }, function () {
                    // In this block you can do something with new state.
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    _flItemSeparator = () => {
        return (
            <View style={{ height: 2, width: "100%", backgroundColor: "skyblue" }} />
        );
    }

    _keyExtractor = (item, index) => String(index);

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={0.5}>
                <Text style={styles.itemStyle}>{item.word}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
                    <View style={{ paddingRight: 10 }}>
                        <TouchableOpacity onLongPress={this._aLetterPress} onPress={this._aLetterPress} activeOpacity={0.8} style={styles.buttonStyle} >
                            <Text style={styles.buttontextStyle}> Letter: {this.state.aletter}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingLeft: 10 }}>
                        <TouchableOpacity onLongPress={this._bLetterPress} onPress={this._bLetterPress} activeOpacity={0.8} style={styles.buttonStyle} >
                            <Text style={styles.buttontextStyle}> Letter: {this.state.bletter}</Text>
                        </TouchableOpacity>
                    </View >
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
                    <TextInput
                        style={styles.inputFieldStyle}
                        placeholder="Your word"
                        autoCorrect={false}
                        ref={input => { this.textInput = input }}
                        onChangeText={(text) => this.setState({ partword: text })}
                    />

                    <Icon.Button name="search-plus" backgroundColor="#3b5998" onPress={this._inputChange.bind(this)}>
                        Search
                    </Icon.Button>
                </View>

                <FlatList
                    data={this.state.dataItems}
                    ItemSeparatorComponent={this._flItemSeparator}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
            </View >

        );
    }
}


const styles = StyleSheet.create({
    containerStyle: {
        /* justifyContent: 'flex-start', */
        margin: 7
    },
    buttonStyle: {
        padding: 10,
        backgroundColor: '#00BCD4',
        borderRadius: 3,
    },
    buttontextStyle: {
        color: '#fff',
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    itemStyle: {
        padding: 5,
        fontSize: 24,
        height: 48,
    },
    inputFieldStyle: {
        width: screenwidth * .7,
        margin: 3,
        height: 44,
        borderColor: '#7a42f4',
        borderWidth: 2
    },
});

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../database/firebaseDB';

export default function NotesScreen({ navigation, route }) {
	const [ notes, setNotes ] = useState([]);
	const db = firebase.firestore().collection("todos");

	// firebase.firestore().collection("testing").add(
	//   {
	//     title:"Testing!",
	//     body: "This is to check",
	//     potato: true,
	//     question: "Why is there a potato bool here?",
	//   }
	// );

	useEffect(() => {
		const unsubscribe = db
		.orderBy("created")
		.onSnapshot((snapshot) => {
			const updateNotes = snapshot.docs.map((doc) => {
				const noteObject = {
					...doc.data(),
					id: doc.id,
				};
				return noteObject;
			});
			setNotes(updateNotes);
			// console.log(updateNotes);
			// console.log(snapshot);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	// This is to set up the top right button
	useEffect(() => {
		console.log('I am in useEffect');
		console.log(notes);

		notes.map((item) => {
      console.log(item);
      // firebase.firestore().collection("todos").add(item);
		});

		// firebase.firestore().collection("todos").add(notes);
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={addNote}>
					<Ionicons
						name="ios-create-outline"
						size={30}
						color="black"
						style={{
							color: '#f55',
							marginRight: 10
						}}
					/>
				</TouchableOpacity>
			)
		});
	});

	// Monitor route.params for changes and add items to the database
	useEffect(() => {
	  if (route.params?.text) {
	    const newNote = {
	      title: route.params.text,
		  done: false,
		  created: firebase.firestore.FieldValue.serverTimestamp()
	    //   id: notes.length.toString(),
	    };
	    db.add(newNote);
	    // setNotes([...notes, newNote]);
	  }
	}, [route.params?.text]);

	function addNote() {
		navigation.navigate('Add Screen');
	}

	// This deletes an individual note
	function deleteNote(id) {
		console.log('Deleting ' + id);
		// To delete that item, we filter out the item we don't want
		// setNotes(notes.filter((item) => item.id !== id));

		// firebase.firestore().collection('todos').doc('id').delete();
		//this is just hidding the notes. No, it is updating the existing collection. 

		//Old Method
		// db.where("id", "==", id)
		// .get()
		// .then((querySnapshot)=>{
		// 	querySnapshot.forEach((doc)=>doc.ref.delete());
		// });

		db.doc(id).delete();

	}

	// The function to render each row in our FlatList
	function renderItem({ item }) {
		return (
			<View
				style={{
					padding: 10,
					paddingTop: 20,
					paddingBottom: 20,
					borderBottomColor: '#ccc',
					borderBottomWidth: 1,
					flexDirection: 'row',
					justifyContent: 'space-between'
				}}
			>
				<Text>{item.title}</Text>
				<TouchableOpacity onPress={() => deleteNote(item.id)}>
					<Ionicons name="trash" size={16} color="#944" />
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={notes}
				renderItem={renderItem}
				style={{ width: '100%' }}
				keyExtractor={(item) => item.id.toString()}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffc',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

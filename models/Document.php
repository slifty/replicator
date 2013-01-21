<?php
require_once("DBConn.php");
require_once("FactoryObject.php");
class Document extends FactoryObject{
	
	# Constants
	
	
	# Static Variables
	
	
	# Instance Variables
	private $title; // string
	private $body; // string
	private $hashtag; // string
	private $dateCreated; // timestamp
	
	
	# FactoryObject Methods
	protected static function gatherData($objectString) {
		$dataArrays = array();
		
		// Load an empty object
		if($objectString === FactoryObject::INIT_EMPTY) {
			$dataArray = array();
			$dataArray['itemId'] = 0;
			$dataArray['title'] = "";
			$dataArray['body'] = "";
			$dataArray['hashtag'] = "";
			$dataArray['dateCreated'] = 0;
			$dataArrays[] = $dataArray;
			return $dataArrays;
		}
		
		// Load a default object
		if($objectString === FactoryObject::INIT_DEFAULT) {
			$dataArray = array();
			$dataArray['itemId'] = 0;
			$dataArray['title'] = "";
			$dataArray['body'] = "";
			$dataArray['hashtag'] = "";
			$dataArray['dateCreated'] = 0;
			$dataArrays[] = $dataArray;
			return $dataArrays;
		}
		
		// Set up for lookup
		$mysqli = DBConn::connect();
		
		// Load the object data
		$queryString = "SELECT document.id AS itemId,
							   document.title AS title,
							   document.body AS body,
							   document.hashtag AS hashtag,
							   unix_timestamp(document.date_created) AS dateCreated
						  FROM document
						 WHERE document.id IN (".$objectString.")";
		
		$result = $mysqli->query($queryString)
			or print($mysqli->error);
		
		while($resultArray = $result->fetch_assoc()) {
			$dataArray = array();
			$dataArray['itemId'] = $resultArray['itemId'];
			$dataArray['title'] = $resultArray['title'];
			$dataArray['body'] = $resultArray['body'];
			$dataArray['hashtag'] = $resultArray['hashtag'];
			$dataArray['dateCreated'] = $resultArray['dateCreated'];
			$dataArrays[] = $dataArray;
		}
		
		$result->free();
		return $dataArrays;
	}
	
	public function load($dataArray) {
		parent::load($dataArray);
		$this->title = isset($dataArray["title"])?$dataArray["title"]:"";
		$this->body = isset($dataArray["body"])?$dataArray["body"]:"";
		$this->hashtag = isset($dataArray["hashtag"])?$dataArray["hashtag"]:"";
		$this->dateCreated = isset($dataArray["dateCreated"])?$dataArray["dateCreated"]:0 ;
	}
	
	
	# Data Methods
	public function validate() {
		return parent::validate();
	}
	
	public function save() {
		if(!$this->validate()) return;
		
		$mysqli = DBConn::connect();
		
		if($this->isUpdate()) {
			// Update an existing record
			$queryString = "UPDATE document
							   SET document.title = ".DBConn::clean($this->getTitle()).",
							   AND document.body = ".DBConn::clean($this->getBody()).",
							   AND document.hashtag = ".DBConn::clean($this->getHashtag()).",
							 WHERE document.id = ".DBConn::clean($this->getItemId());
							
			$mysqli->query($queryString) or print($mysqli->error);
		} else {
			// Create a new record
			$queryString = "INSERT INTO document
								   (document.id,
									document.title,
									document.body,
									document.hashtag,
									document.date_created)
							VALUES (0,
									".DBConn::clean($this->getTitle()).",
									".DBConn::clean($this->getBody()).",
									".DBConn::clean($this->getHashtag()).",
									NOW())";
			
			$mysqli->query($queryString) or print($mysqli->error);
			$this->setItemId($mysqli->insert_id);
		}
		
		// Parent Operations
		return parent::save();
	}
	
	public function delete() {
		parent::delete();
		$mysqli = DBConn::connect();
		
		// Delete this record
		$queryString = "DELETE FROM document
							  WHERE document.id = ".DBConn::clean($this->getItemId());
		$mysqli->query($queryString);
	}
	
	
	# Getters
	public function getTitle() { return $this->title;}
	
	public function getBody() { return $this->body;}
	
	public function getHashtag() { return $this->hashtag;}
	
	public function getDateCreated() { return $this->dateCreated;}
	
	
	# Setters
	public function setTitle($str) { $this->title = $str;}
	
	public function setBody($str) { $this->body = $str;}

	public function setHashtag($str) { $this->hashtag = $str;}
	
	
	# Replicator Methods
	public function getTweet() {
		
	}
}

?>
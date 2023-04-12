CREATE TABLE Users (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(50) NOT NULL,
  Email VARCHAR(50) NOT NULL UNIQUE,
  Password VARCHAR(100) NOT NULL,
  DoB DATE,
  Profile_Image Blob
);

CREATE TABLE Artists (
  ArtistID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(50) NOT NULL,
  Genre VARCHAR(50),
  Image Blob
);

CREATE TABLE Albums (
  AlbumID INT AUTO_INCREMENT PRIMARY KEY,
  ArtistID INT,
  Name VARCHAR(50) NOT NULL,
  Release_Date DATE,
  Image VARCHAR(255),
  FOREIGN KEY (ArtistID) REFERENCES Artists(ArtistID)
);

CREATE TABLE Tracks (
  TrackID INT AUTO_INCREMENT PRIMARY KEY,
  AlbumID INT,
  Name VARCHAR(50) NOT NULL,
  Duration INT NOT NULL,
  Path VARCHAR(255),
  FOREIGN KEY (AlbumID) REFERENCES Albums(AlbumID)
);

CREATE TABLE Playlists (
  PlaylistID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT,
  Name VARCHAR(50) NOT NULL,
  Image Blob,
  FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Playlist_Tracks (
  PlaylistID INT,
  TrackID INT,
  `Order` INT,
  PRIMARY KEY (PlaylistID, TrackID),
  FOREIGN KEY (PlaylistID) REFERENCES Playlists(PlaylistID),
  FOREIGN KEY (TrackID) REFERENCES Tracks(TrackID)
);
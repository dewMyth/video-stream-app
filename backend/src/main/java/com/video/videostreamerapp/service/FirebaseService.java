package com.video.videostreamerapp.service;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.UUID;

@Service
public class FirebaseService implements FileService {
    @Override
    public String uploadFile(MultipartFile file) throws IOException {

        // Prepare a Key
        var filenameExt = StringUtils.getFilenameExtension(file.getOriginalFilename());
        var key = UUID.randomUUID().toString() + "." + filenameExt;

        // Convert toFile type
        File tempFile = new File(key);
        try(FileOutputStream fos = new FileOutputStream(tempFile)){
            fos.write(file.getBytes());
            fos.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        String firebaseServiceFilePath = System.getProperty("user.dir") + File.separator + "fb-key.json";;
        System.out.println(firebaseServiceFilePath);


        // Upload to Firebase
        var fileUrl = "";
        try{
            BlobId blobId = BlobId.of("video-stream-app-cf76a.appspot.com", key);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType("media").build();
            Credentials credentials = GoogleCredentials.fromStream(new FileInputStream(firebaseServiceFilePath));
            Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
            storage.create(blobInfo, Files.readAllBytes(tempFile.toPath()));
            fileUrl = String.format("https://firebasestorage.googleapis.com/v0/b/video-stream-app-cf76a.appspot.com/o/%s?alt=media", URLEncoder.encode(key, StandardCharsets.UTF_8));
        } catch (IOException e){
            System.out.println(e);
            throw new IOException();
        }

        return fileUrl;
    }
}

package com.cxy61.girls;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.net.Uri;
import io.rong.imlib.model.UserInfo;

import java.util.ArrayList;
import java.util.List;

public class Utils {

    public static long insert(SQLiteDatabase db,String username,String nickname,String thumb){
        ContentValues values = new ContentValues();
        values.put("username",username);
        values.put("nickname", nickname);
        values.put("thumb", thumb);
        long id=db.insert("users", null, values);
        db.close();
        return id;
    }

    public static UserInfo query(SQLiteDatabase db, String to_username) {
        Cursor cursor = db.query("users",new String[]{"id","username","nickname","thumb"},"username=?",new String[]{to_username},null,null,null);
        UserInfo user = null;
        while(cursor.moveToNext()){
            String username = cursor.getString(cursor.getColumnIndex("username"));
            String nickname = cursor.getString(cursor.getColumnIndex("nickname"));
            String thumb = cursor.getString(cursor.getColumnIndex("thumb"));
            user=new UserInfo(username,nickname, Uri.parse(thumb));
        }
        db.close();
        return  user;
    }

    public static int queryAll(SQLiteDatabase db) {
        Cursor cursor = db.query("users",null,null,null,null,null,null);
        List<UserInfo> users=new ArrayList<UserInfo>();
        UserInfo user = null;
        while(cursor.moveToNext()){
            String username = cursor.getString(cursor.getColumnIndex("username"));
            String nickname = cursor.getString(cursor.getColumnIndex("nickname"));
            String thumb = cursor.getString(cursor.getColumnIndex("thumb"));
            user=new UserInfo(username,nickname, Uri.parse(thumb));
            users.add(user);
        }
        db.close();
        return  users.size();
    }

    public static int deleteAll(SQLiteDatabase db) {
        int result=0;
        result =db.delete("users",null,null);
        db.close();
        return result;
    }
}

package com.cxy61.girls;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class DBOpenHelper extends SQLiteOpenHelper {
	private static String name="grogram_girl.db";
	private static int version=1;

	public DBOpenHelper(Context context) {
		super(context, name, null, version);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void onCreate(SQLiteDatabase db) {
		// TODO Auto-generated method stub
		String sql="CREATE TABLE users("+"id INTEGER primary key autoincrement, "+"username varchar(16) not null, "+"nickname varchar(16) not null, "+"thumb varchar(256) not null"+")";
		db.execSQL(sql);
	}

	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
		// TODO Auto-generated method stub
	}

}

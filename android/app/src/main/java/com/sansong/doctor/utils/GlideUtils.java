package com.sansong.doctor.utils;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapShader;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.os.Looper;
import android.support.annotation.NonNull;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.Priority;
import com.bumptech.glide.load.engine.bitmap_recycle.BitmapPool;
import com.bumptech.glide.load.engine.cache.ExternalCacheDiskCacheFactory;
import com.bumptech.glide.load.engine.cache.InternalCacheDiskCacheFactory;
import com.bumptech.glide.load.resource.bitmap.BitmapTransformation;
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions;
import com.sansong.doctor.R;

import java.io.File;
import java.math.BigDecimal;
import java.security.MessageDigest;

/**
 * Created by wbf on on 2019/1/9.
 */
public class GlideUtils {
    //占位图
    private static final int PLACEHOLDER_IMG = R.mipmap.loading_error;

    //加载图片
    public static void load(Context context, String url, ImageView view) {
        Glide.with(context)
                .load(url)
                .error(PLACEHOLDER_IMG)
                .skipMemoryCache(true) // 不使用内存缓存
//                .crossFade()
                .transition(DrawableTransitionOptions.withCrossFade(300))//淡入淡出300m 4.0后废弃
                .into(view);
    }

    //加载本地
    public static void load(Context context, int url, ImageView view) {
        Glide.with(context)
                .load(url)
                .error(PLACEHOLDER_IMG)
                .into(view);
    }

    //加载图片 自定义错误图片
    public static void load(Context context, String url, ImageView view, int loadingError) {
        Glide.with(context)
                .load(url)
                .error(loadingError)
                .into(view);
    }

    //加载本地圆角图片
    public static void loadRoundTransform(Context context, int url, ImageView view, int roundDp) {
        Glide.with(context).load(url).centerCrop().transform(new GlideRoundTransform(context, roundDp)).into(view);
    }

    //加载圆角图片
    public static void loadRoundTransform(Context context, String url, ImageView view, int roundDp, int loadingError) {
        Glide.with(context)
                .load(url)
                .error(loadingError)
                .centerCrop()
                .transform(new GlideRoundTransform(context, roundDp))
                .into(view);
    }

    //加载圆角图片
    public static void loadRoundTransform(Context context, String url, ImageView view, int roundDp) {
        Glide.with(context)
                .load(url)
                .error(PLACEHOLDER_IMG)
                .centerCrop()
                .transform(new GlideRoundTransform(context, roundDp))
                .into(view);
    }

    public static class GlideRoundTransform extends BitmapTransformation {
        private static final String ID = "com.bumptech.glide.load.resource.bitmap.Round";
        private static final byte[] ID_BYTES = ID.getBytes(CHARSET);
        private static float radius = 0f;

        public GlideRoundTransform(Context context, int dp) {
            super();
            this.radius = Resources.getSystem().getDisplayMetrics().density * dp;
        }

        @Override
        protected Bitmap transform(BitmapPool pool, Bitmap toTransform, int outWidth, int outHeight) {
            return roundCrop(pool, toTransform);
        }

        private static Bitmap roundCrop(BitmapPool pool, Bitmap source) {
            if (source == null) return null;

            Bitmap result = pool.get(source.getWidth(), source.getHeight(), Bitmap.Config.ARGB_8888);
            if (result == null) {
                result = Bitmap.createBitmap(source.getWidth(), source.getHeight(), Bitmap.Config.ARGB_8888);
            }

            Canvas canvas = new Canvas(result);
            Paint paint = new Paint();
            paint.setShader(new BitmapShader(source, BitmapShader.TileMode.CLAMP, BitmapShader.TileMode.CLAMP));
            paint.setAntiAlias(true);
            RectF rectF = new RectF(0f, 0f, source.getWidth(), source.getHeight());
            canvas.drawRoundRect(rectF, radius, radius, paint);
            return result;
        }

//        @Override
//        public String getId() {
//            return getClass().getName() + Math.round(radius); //3.+的方法
//        }

        @Override
        public boolean equals(Object o) {
            return o instanceof GlideRoundTransform;
        }

        @Override
        public int hashCode() {
            return ID.hashCode();
        }

        @Override
        public void updateDiskCacheKey(@NonNull MessageDigest messageDigest) {
            messageDigest.update(ID_BYTES);
        }
    }

    public static void loadLow(Context context, int drawable, ImageView view) {
        Glide.with(context)
                .load(drawable)
                .priority(Priority.LOW)
                .dontAnimate()
                .into(view);
    }

    // 获取Glide磁盘缓存大小
    public static String getCacheSize(Context context) {
        try {
            return getFormatSize(getFolderSize(new File(context.getCacheDir() + "/" + InternalCacheDiskCacheFactory.DEFAULT_DISK_CACHE_DIR)));
        } catch (Exception e) {
            e.printStackTrace();
            return "获取失败";
        }
    }

    // 清除Glide磁盘缓存，自己获取缓存文件夹并删除方法
    public static boolean cleanCatchDisk(Context context) {
        return deleteFolderFile(context.getCacheDir() + "/" + ExternalCacheDiskCacheFactory.DEFAULT_DISK_CACHE_DIR, true);
    }

    // 清除图片磁盘缓存，调用Glide自带方法
    public static boolean clearCacheDiskSelf(Context context) {
        try {
            if (Looper.myLooper() == Looper.getMainLooper()) {
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        Glide.get(context).clearDiskCache();
                    }
                }).start();
            } else {
                Glide.get(context).clearDiskCache();
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 清除Glide内存缓存
    public static boolean clearCacheMemory(Context context) {
        try {
            if (Looper.myLooper() == Looper.getMainLooper()) { //只能在主线程执行
                Glide.get(context).clearMemory();
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }


    // 获取指定文件夹内所有文件大小的和
    private static long getFolderSize(File file) throws Exception {
        long size = 0;
        try {
            File[] fileList = file.listFiles();
            for (File aFileList : fileList) {
                if (aFileList.isDirectory()) {
                    size = size + getFolderSize(aFileList);
                } else {
                    size = size + aFileList.length();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return size;
    }

    // 格式化单位
    private static String getFormatSize(double size) {
        double kiloByte = size / 1024;
        if (kiloByte < 1) {
            return size + "Byte";
        }
        double megaByte = kiloByte / 1024;
        if (megaByte < 1) {
            BigDecimal result1 = new BigDecimal(Double.toString(kiloByte));
            return result1.setScale(2, BigDecimal.ROUND_HALF_UP).toPlainString() + "KB";
        }
        double gigaByte = megaByte / 1024;
        if (gigaByte < 1) {
            BigDecimal result2 = new BigDecimal(Double.toString(megaByte));
            return result2.setScale(2, BigDecimal.ROUND_HALF_UP).toPlainString() + "MB";
        }
        double teraBytes = gigaByte / 1024;
        if (teraBytes < 1) {
            BigDecimal result3 = new BigDecimal(Double.toString(gigaByte));
            return result3.setScale(2, BigDecimal.ROUND_HALF_UP).toPlainString() + "GB";
        }
        BigDecimal result4 = new BigDecimal(teraBytes);
        return result4.setScale(2, BigDecimal.ROUND_HALF_UP).toPlainString() + "TB";
    }

    // 按目录删除文件夹文件方法
    private static boolean deleteFolderFile(String filePath, boolean deleteThisPath) {
        try {
            File file = new File(filePath);
            if (file.isDirectory()) {
                File files[] = file.listFiles();
                for (File file1 : files) {
                    deleteFolderFile(file1.getAbsolutePath(), true);
                }
            }
            if (deleteThisPath) {
                if (!file.isDirectory()) {
                    file.delete();
                } else {
                    if (file.listFiles().length == 0) {
                        file.delete();
                    }
                }
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}

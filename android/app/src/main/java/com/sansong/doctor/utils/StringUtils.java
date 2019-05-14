package com.sansong.doctor.utils;

import android.content.ClipboardManager;
import android.content.Context;
import android.widget.Toast;

import java.io.UnsupportedEncodingException;
import java.util.Collection;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;


public class StringUtils {

    public static String filterNull(Object obj) {
        return obj == null ? "" : obj.toString();
    }

    public static boolean isEmpty(String str) {
        return str == null || str.length() == 0 || "null".equalsIgnoreCase(str);
    }

    public static boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }

    public static boolean isBlank(String str) {
        if (isEmpty(str)) {
            return true;
        } else {
            for(int i = 0; i < str.length(); ++i) {
                if (!Character.isWhitespace(str.charAt(i))) {
                    return false;
                }
            }

            return true;
        }
    }

    public static boolean isNotBlank(String str) {
        return !isBlank(str);
    }

    public static String toString(String str) {
        return isBlank(str) ? "" : str;
    }

    public static String toStringWithoutBlank(String str) {
        return isEmpty(str) ? "" : str;
    }

    public static boolean isEmpty(String[] c) {
        return c == null || c.length <= 0;
    }

    public static boolean isNotEmpty(String[] c) {
        return c != null && c.length > 0;
    }

    public static boolean isEmpty(Collection<?> c) {
        return c == null || c.isEmpty();
    }

    public static boolean isNotEmpty(Collection<?> c) {
        return c != null && !c.isEmpty();
    }

    public static boolean isEmpty(Map<?, ?> m) {
        return m == null || m.isEmpty();
    }

    public static boolean isNotEmpty(Map<?, ?> m) {
        return m != null && !m.isEmpty();
    }

    public static String getLimitLengthString(String content, int len) {
        if (len < 0) {
            return content;
        } else {
            try {
                return getLimitLengthString(content, (String)null, len, (String)null);
            } catch (UnsupportedEncodingException var3) {
                return content;
            }
        }
    }

    public static String getLimitLengthString(String content, int len, String symbol) {
        if (len < 0) {
            return content;
        } else {
            try {
                return getLimitLengthString(content, (String)null, len, symbol);
            } catch (UnsupportedEncodingException var4) {
                return content;
            }
        }
    }

    public static String getLimitLengthString(String content, String charsetName, int len, String symbol) throws UnsupportedEncodingException {
        if (content != null && content.length() != 0) {
            if (symbol == null) {
                symbol = "";
            }

            int counterOfDoubleByte = 0;
            byte[] b;
            if (charsetName == null) {
                b = content.getBytes("UTF-8");
            } else {
                b = content.getBytes(charsetName);
            }

            if (b.length <= len) {
                return content;
            } else {
                if (len > symbol.length()) {
                    len -= symbol.length();
                }

                for(int i = 0; i < len; ++i) {
                    if (b[i] < 0) {
                        ++counterOfDoubleByte;
                    }
                }

                if (counterOfDoubleByte % 2 != 0) {
                    --len;
                }

                byte[] newBytes = new byte[len];
                System.arraycopy(b, 0, newBytes, 0, len);
                if (charsetName == null) {
                    return new String(newBytes, "UTF-8") + symbol;
                } else {
                    return new String(newBytes, charsetName) + symbol;
                }
            }
        } else {
            return content;
        }
    }

    public static String toHTML(String text) {
        return toHTML(text, true);
    }

    public static String toHTML(String text, boolean isEscapeSpace) {
        if (isEmpty(text)) {
            return "";
        } else {
            char[] content = new char[text.length()];
            text.getChars(0, text.length(), content, 0);
            StringBuffer result = new StringBuffer();

            for(int i = 0; i < content.length; ++i) {
                switch(content[i]) {
                    case '\n':
                        result.append("<br/>");
                    case '\r':
                        break;
                    case ' ':
                        if (isEscapeSpace) {
                            result.append("&nbsp;");
                        } else {
                            result.append(content[i]);
                        }
                        break;
                    case '"':
                        result.append("&quot;");
                        break;
                    case '&':
                        result.append("&amp;");
                        break;
                    case '\'':
                        result.append("&#039;");
                        break;
                    case '<':
                        result.append("&lt;");
                        break;
                    case '>':
                        result.append("&gt;");
                        break;
                    default:
                        result.append(content[i]);
                }
            }

            return result.toString();
        }
    }

    public static String oppHTML(String text) {
        return isEmpty(text) ? "" : text.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("<br/>", "\n").replaceAll("&amp;", "&").replaceAll("&#039;", "'").replaceAll("&quot;", "\"").replaceAll("&nbsp;", " ");
    }

    public static String subString(String str, int beginIndex, int endIndex) {
        if (isEmpty(str)) {
            return "";
        } else {
            beginIndex = beginIndex < 0 ? 0 : (beginIndex < str.length() ? beginIndex : str.length() - 1);
            endIndex = endIndex < 0 ? 0 : (endIndex < str.length() ? endIndex : str.length() - 1);
            return str.substring(beginIndex, endIndex);
        }
    }

    public static int checkLength(String str) {
        if (!isEmpty(str) && !isEmpty(str.trim())) {
            String strWithNoTrim = str.trim();
            String regEx = "[\\u4e00-\\u9fa5]";
            Pattern p = Pattern.compile(regEx);
            Matcher m = p.matcher(strWithNoTrim);

            int len;
            for(len = 0; m.find(); ++len) {
                ;
            }

            int count = strWithNoTrim.length() + len;
            return count;
        } else {
            return 0;
        }
    }

    public static String SpecialWaste(String text) {
        return text == null ? null : SpecialWaste(text, 0, text.length() - 1);
    }

    public static String SpecialWaste(String text, int start, int end) {
        if (text != null && start >= 0 && start < end && end < text.length()) {
            try {
                String p = text.substring(0, start);
                String e = text.substring(end, text.length() - 1);
                String mi = text.substring(start, end);
                Pattern pa = Pattern.compile("\\s*|\t|\r|\n");
                return p + pa.matcher(mi).replaceAll("") + e;
            } catch (Exception var7) {
                var7.printStackTrace();
                return text;
            }
        } else {
            return text;
        }
    }

    public static String stringFilter(String str) throws PatternSyntaxException {
        String regEx = "[\\\\^/:*?\"<>|]+";
        return str.replaceAll(regEx, "").trim();
    }

    public static String makeupStringWithSplit(String split, String... params) {
        StringBuilder sb = new StringBuilder();
        if (params != null && params.length > 0) {
            sb.append(params[0]);

            for(int i = 1; i < params.length; ++i) {
                if (split != null) {
                    sb.append(split);
                }

                sb.append(params[i]);
            }
        }

        return sb.toString();
    }

    public static String makeupString(String... params) {
        return makeupStringWithSplit((String)null, params);
    }

    public static String makeupStringWithUnderline(String... params) {
        return makeupStringWithSplit("_", params);
    }

    /*复制*/
    public static void copyText(Context context, String text) {
        ClipboardManager cm = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        if (null != cm) {
            cm.setText(text);
            Toast.makeText(context, "复制成功！", Toast.LENGTH_SHORT).show();
        }
    }
}

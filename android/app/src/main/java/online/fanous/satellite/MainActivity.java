package online.fanous.satellite;
import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.*;
import android.view.*;
import android.widget.*;
import org.json.JSONObject;
import java.util.*;
import java.util.concurrent.*;
import okhttp3.*;
public final class MainActivity extends Activity {
    static final String BASE="https://fanous.online/satellite-api";
    private final OkHttpClient http=new OkHttpClient();
    private final ScheduledExecutorService worker=Executors.newSingleThreadScheduledExecutor();
    private final Handler ui=new Handler(Looper.getMainLooper());
    private TextView status,code;private EditText email,name;private LinearLayout layout;
    private boolean fa=Locale.getDefault().getLanguage().equals("fa"),saving=false;private String pairId="",pairSecret="",verification="https://fanous.online/satellite";
    private String l(String persian,String english){return fa?persian:english;}
    @Override public void onCreate(Bundle state){super.onCreate(state);render();worker.scheduleWithFixedDelay(this::poll,2,2,TimeUnit.SECONDS);}
    private void render(){
        ScrollView scroll=new ScrollView(this);scroll.setBackgroundColor(Color.rgb(11,24,35));layout=new LinearLayout(this);layout.setOrientation(LinearLayout.VERTICAL);layout.setPadding(30,38,30,30);scroll.addView(layout);setContentView(scroll);
        title(l("ماهوارهٔ خودت را بساز","Build your own satellite"),26);text(l("حسگرهای واقعی گوشی ← سرور فانوس ← نمایش زنده روی گوشی و لپ‌تاپ","Real phone sensors → Fanous relay → live phone/laptop dashboard"));
        button("فارسی / English",()->{fa=!fa;render();});
        email=new EditText(this);email.setTextColor(Color.WHITE);email.setHintTextColor(Color.LTGRAY);email.setHint(l("ایمیل حساب گوگل","Google account email"));email.setInputType(33);layout.addView(email);
        name=new EditText(this);name.setTextColor(Color.WHITE);name.setHintTextColor(Color.LTGRAY);name.setHint(l("نام گوشی","Phone name"));name.setText(Build.MODEL);layout.addView(name);
        code=text("");status=text(PrivateStore.get(this,"token").isEmpty()?l("ابتدا درخواست اتصال بفرستید.","Request pairing first."):l("گوشی متصل شده؛ برای ارسال شروع را بزنید.","Phone paired. Press Start to publish."));
        button(l("درخواست اتصال به حساب","Request account pairing"),this::pair);
        button(l("ورود گوگل و تأیید در فانوس","Open Fanous to sign in & approve"),()->startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse(verification))));
        button(l("شروع ارسال حسگرها و GPS","Start sensors & GPS"),()->permissions(false));
        button(l("دوربین عقب: فعال‌سازی با مجوز","Enable rear camera with permission"),()->permissions(true));
        button(l("توقف دوربین","Stop camera"),()->command("CAMERA_OFF"));
        button(l("حالت رله و ذخیرهٔ نمایشگر","Relay / display-saving mode"),this::saving);
        button(l("نمایش داشبورد زنده","Open live dashboard"),()->startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse("https://fanous.online/satellite"))));
        button(l("توقف کامل ارسال","Stop all transmission"),()->{command("STOP");status.setText(l("ارسال متوقف شد.","Transmission stopped."));});
        button(l("حذف اتصال این گوشی","Forget this pairing"),()->{command("STOP");PrivateStore.clear(this);status.setText(l("اتصال محلی پاک شد؛ برای ابطال سرور از داشبورد استفاده کنید.","Local pairing cleared; revoke the device in the dashboard too."));});
        text(l("ایمیل به‌تنهایی مجوز نمی‌دهد؛ کد روی این گوشی باید در حساب گوگل همان ایمیل تأیید شود. ارسال فقط با شروع شماست و اعلان دائمی دارد. دوربین فقط با اقدام محلی شما روشن می‌شود. برای کار در پس‌زمینه، در صورت نیاز محدودیت باتری برنامه را در تنظیمات اندروید بررسی کنید.","An email alone grants no access: approve this phone's code while signed in to that Google account. Publishing is user-started with an ongoing notification. Camera starts only from this phone. OEM battery restrictions can affect background operation."));
    }
    private TextView text(String s){TextView v=new TextView(this);v.setText(s);v.setTextColor(Color.rgb(196,215,221));v.setTextSize(15);v.setPadding(0,14,0,14);layout.addView(v);return v;}
    private void title(String s,int size){TextView v=text(s);v.setTextSize(size);v.setTextColor(Color.rgb(232,197,139));}
    private void button(String s,Runnable action){Button b=new Button(this);b.setText(s);b.setAllCaps(false);layout.addView(b,new LinearLayout.LayoutParams(-1,-2));b.setOnClickListener(v->action.run());}
    private JSONObject post(String path,JSONObject value)throws Exception{Request request=new Request.Builder().url(BASE+path).post(RequestBody.create(value.toString(),MediaType.get("application/json"))).build();try(Response r=http.newCall(request).execute()){JSONObject result=new JSONObject(r.body().string());if(!r.isSuccessful()&&!result.has("status"))throw new Exception(result.optString("error","Request failed"));return result;}}
    private void pair(){String address=email.getText().toString().trim(),label=name.getText().toString().trim();status.setText(l("ارسال درخواست…","Requesting pairing…"));worker.execute(()->{try{JSONObject r=post("/pair/request",new JSONObject().put("email",address).put("name",label).put("model",Build.MANUFACTURER+" "+Build.MODEL));pairId=r.getString("id");pairSecret=r.getString("secret");verification=r.getString("verificationUrl");ui.post(()->{code.setText(l("کد اتصال: ","Pairing code: ")+r.optString("code"));status.setText(l("در فانوس با همین ایمیل وارد شوید و این کد را تأیید کنید.","Sign in to Fanous with this email and approve this code."));});}catch(Exception e){showError(e);}});}
    private void poll(){if(pairId.isEmpty())return;try{JSONObject r=post("/pair/claim",new JSONObject().put("id",pairId).put("secret",pairSecret));String state=r.optString("status");if(state.equals("approved")){PrivateStore.put(this,"token",r.getString("token"));PrivateStore.put(this,"deviceId",r.getString("deviceId"));pairId="";pairSecret="";ui.post(()->status.setText(l("تأیید شد؛ اکنون ارسال را شروع کنید.","Approved. You can now start publishing.")));}else if(state.equals("expired")||state.equals("rejected")){pairId="";ui.post(()->status.setText(l("درخواست منقضی یا رد شد؛ دوباره درخواست دهید.","Pairing expired/rejected; request again.")));}}catch(Exception ignored){}}
    private void permissions(boolean camera){if(PrivateStore.get(this,"token").isEmpty()){status.setText(l("ابتدا گوشی را تأیید کنید.","Pair and approve this phone first."));return;}ArrayList<String> list=new ArrayList<>();if(checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)!=PackageManager.PERMISSION_GRANTED)list.add(Manifest.permission.ACCESS_FINE_LOCATION);if(checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION)!=PackageManager.PERMISSION_GRANTED)list.add(Manifest.permission.ACCESS_COARSE_LOCATION);if(Build.VERSION.SDK_INT>=33&&checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)list.add(Manifest.permission.POST_NOTIFICATIONS);if(camera&&checkSelfPermission(Manifest.permission.CAMERA)!=PackageManager.PERMISSION_GRANTED)list.add(Manifest.permission.CAMERA);if(list.isEmpty())command(camera?"CAMERA_ON":"START");else requestPermissions(list.toArray(new String[0]),camera?22:21);}
    @Override public void onRequestPermissionsResult(int request,String[] permissions,int[] results){super.onRequestPermissionsResult(request,permissions,results);if(request==22&&checkSelfPermission(Manifest.permission.CAMERA)!=PackageManager.PERMISSION_GRANTED){status.setText(l("مجوز دوربین داده نشد؛ حسگرها بدون دوربین قابل استفاده‌اند.","Camera denied; sensor relay can still run."));return;}command(request==22?"CAMERA_ON":"START");}
    private void command(String action){if(!action.equals("STOP")&&PrivateStore.get(this,"token").isEmpty()){status.setText(l("ابتدا گوشی را تأیید کنید.","Pair this phone first."));return;}Intent i=new Intent(this,TelemetryService.class).setAction(action);if(action.equals("STOP")){stopService(i);return;}startForegroundService(i);status.setText(l("درخواست اجرا شد؛ وضعیت زنده را در داشبورد ببینید.","Command sent; check the live dashboard for connection status."));}
    private void saving(){command("RELAY");saving=true;WindowManager.LayoutParams p=getWindow().getAttributes();p.screenBrightness=.01f;getWindow().setAttributes(p);TextView black=new TextView(this);black.setBackgroundColor(Color.BLACK);black.setTextColor(Color.DKGRAY);black.setGravity(Gravity.CENTER);black.setText(l("رله فعال است\nبرای بازگشت لمس کنید؛ می‌توانید نمایشگر را خاموش کنید.","Relay active\nTap to return. You can turn the display off."));setContentView(black);black.setOnClickListener(v->{saving=false;WindowManager.LayoutParams q=getWindow().getAttributes();q.screenBrightness=-1;getWindow().setAttributes(q);render();});}
    private void showError(Exception e){ui.post(()->status.setText(l("خطا: ","Error: ")+e.getMessage()));}
    @Override protected void onDestroy(){worker.shutdownNow();super.onDestroy();}
}

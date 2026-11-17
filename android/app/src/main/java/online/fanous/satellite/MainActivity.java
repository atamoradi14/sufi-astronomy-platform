package online.fanous.satellite;
import android.Manifest;
import android.app.*;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.*;
import android.provider.Settings;
import android.view.*;
import android.widget.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;
import java.util.concurrent.*;
import org.json.JSONObject;
import okhttp3.*;
public final class MainActivity extends Activity {
    static final String BASE="https://fanous.online/satellite-api";
    private final OkHttpClient http=new OkHttpClient();
    private final ScheduledExecutorService worker=Executors.newSingleThreadScheduledExecutor();
    private final Handler ui=new Handler(Looper.getMainLooper());
    private LinearLayout layout;private TextView status;private Button connection,cameraButton;private EditText email,name;
    private boolean fa=Locale.getDefault().getLanguage().equals("fa"),saving=false,pairedView=false;private volatile boolean busy=false;
    private volatile String pairId="",pairSecret="";private String code="",notice="";
    private String l(String p,String e){return fa?p:e;}
    private boolean paired(){return !PrivateStore.get(this,"token").isEmpty();}
    @Override public void onCreate(Bundle state){
        super.onCreate(state);pairId=PrivateStore.get(this,"pendingId");pairSecret=PrivateStore.get(this,"pendingSecret");code=PrivateStore.get(this,"pendingCode");
        render();worker.scheduleWithFixedDelay(this::poll,1,2,TimeUnit.SECONDS);ui.post(refresh);
        if(paired())worker.execute(()->{try{post("/device/register",new JSONObject().put("installationId",installationId()),true);}catch(Exception e){showError(e);}});
    }
    private String installationId() throws Exception {
        String id=Settings.Secure.getString(getContentResolver(),Settings.Secure.ANDROID_ID);
        if(id==null||id.isEmpty())throw new Exception("Phone identifier unavailable");
        byte[] hash=MessageDigest.getInstance("SHA-256").digest((getPackageName()+":"+id).getBytes(StandardCharsets.UTF_8));
        StringBuilder out=new StringBuilder();for(byte b:hash)out.append(String.format(Locale.ROOT,"%02x",b&255));return out.toString();
    }
    private final Runnable refresh=new Runnable(){public void run(){if(!saving){if(pairedView!=paired())render();else updateStatus();}ui.postDelayed(this,700);}};
    private void render(){
        pairedView=paired();connection=null;cameraButton=null;
        ScrollView scroll=new ScrollView(this);scroll.setBackgroundColor(0xff0b1823);layout=new LinearLayout(this);layout.setOrientation(LinearLayout.VERTICAL);layout.setPadding(dp(22),dp(28),dp(22),dp(30));layout.setLayoutDirection(fa?View.LAYOUT_DIRECTION_RTL:View.LAYOUT_DIRECTION_LTR);scroll.addView(layout);setContentView(scroll);
        TextView brand=text("FANOUS / SATELLITE");brand.setTextColor(0xff75c1b8);brand.setTextSize(12);
        TextView title=text(l("ماهوارهٔ خودت را بساز","Build your own satellite"));title.setTextSize(27);title.setTextColor(0xffe8c58b);
        button(fa?"English":"فارسی",()->{fa=!fa;render();}).setTextSize(12);status=text(notice);
        if(pairedView){
            text(Build.MODEL+" · "+l("گوشی تأییدشده","Approved phone"));
            connection=button("",()->{if(TelemetryService.running)command("STOP");else permissions(false);});connection.setTextSize(22);connection.setMinHeight(dp(112));
            text(l("سبز: متصل و در حال ارسال. قرمز: متوقف. برای روشن یا خاموش‌کردن لمس کن.","Green: connected and sending. Red: stopped. Tap to switch transmission on or off."));
            cameraButton=button("",()->{if(TelemetryService.cameraActive)command("CAMERA_OFF");else permissions(true);});
            button(l("اتاق کنترل زنده ↗","Live control room ↗"),()->open("https://fanous.online/satellite"));
            button(l("حالت کم‌مصرف رله","Display-saving relay mode"),this::saving);
            text(l("حسگر و موقعیت به حساب خودت ارسال می‌شوند. دوربین اختیاری است و فقط همین‌جا فعال می‌شود.","Sensors and location are sent to your account. Camera is optional and can only be enabled here."));
            button(l("مدیریت اتصال…","Manage pairing…"),()->new AlertDialog.Builder(this).setTitle(l("لغو اتصال این گوشی؟","Cancel this phone’s pairing?"))
                .setMessage(l("اتصال قبلی روی سرور لغو می‌شود. سپس می‌توانی درخواست تازه بدهی. اینترنت لازم است.","The server cancels the existing connection before a new request is allowed. Internet is required."))
                .setNegativeButton(l("بازگشت","Keep pairing"),null).setPositiveButton(l("لغو اتصال","Cancel pairing"),(d,w)->cancel()).show());
        }else if(!pairId.isEmpty()){
            TextView challenge=text(code);challenge.setTextSize(36);challenge.setGravity(Gravity.CENTER);challenge.setTextColor(0xffe8c58b);
            text(l("این کد را در حساب گوگل همان ایمیل تأیید کن. این صفحه خودکار به‌روز می‌شود.","Approve this code while signed in to the same Google email. This screen updates automatically."));
            button(l("ورود و تأیید در فانوس ↗","Sign in & approve on Fanous ↗"),()->open("https://fanous.online/satellite?pair="+Uri.encode(code)));
            button(l("لغو درخواست قبلی","Cancel pending request"),this::cancel);
        }else{
            text(l("فقط یک بار گوشی را به حساب گوگل خودت متصل کن.","Pair this phone with your Google account once."));
            email=new EditText(this);email.setTextColor(Color.WHITE);email.setHintTextColor(Color.LTGRAY);email.setHint(l("ایمیل حساب گوگل","Google account email"));email.setInputType(33);email.setText(PrivateStore.get(this,"email"));layout.addView(email);
            name=new EditText(this);name.setTextColor(Color.WHITE);name.setHintTextColor(Color.LTGRAY);name.setHint(l("نام گوشی","Phone name"));name.setText(Build.MODEL);layout.addView(name);
            button(l("درخواست اتصال","Request pairing"),this::pair);
        }
        updateStatus();
    }
    private void updateStatus(){
        if(connection!=null){boolean online=TelemetryService.connected,running=TelemetryService.running;
            connection.setText(online?l("● متصل · خاموش کن","● CONNECTED · tap to stop"):running?l("◌ در حال اتصال · توقف","◌ CONNECTING · tap to stop"):l("○ خاموش · روشن کن","○ OFF · tap to connect"));
            connection.setBackground(background(online?0xff216e4a:running?0xff855a20:0xff8e343e));connection.setTextColor(Color.WHITE);}
        if(cameraButton!=null)cameraButton.setText(TelemetryService.cameraActive?l("دوربین روشن · خاموش کن","Camera ON · turn off"):l("دوربین خاموش · فعال‌سازی با مجوز","Camera OFF · enable with permission"));
        if(status!=null)status.setText(notice.isEmpty()?(TelemetryService.planRequired?l("زمان آزمایش تمام شد؛ برای خرید طرح اتاق کنترل را باز کن. اتصال گوشی محفوظ است.","Trial ended. Open the control room to purchase a plan; your pairing is saved."):pairedView?l("اتصال ذخیره شده؛ نیازی به درخواست دوباره نیست.","Pairing saved; no new request is needed."):l("اتصال امن با تأیید حساب گوگل","Secure pairing with Google approval")):notice);
    }
    private int dp(int n){return Math.round(n*getResources().getDisplayMetrics().density);}
    private GradientDrawable background(int color){GradientDrawable d=new GradientDrawable();d.setColor(color);d.setCornerRadius(dp(16));return d;}
    private TextView text(String s){TextView v=new TextView(this);v.setText(s);v.setTextColor(0xffc4d7dd);v.setTextSize(15);v.setPadding(0,dp(9),0,dp(9));layout.addView(v);return v;}
    private Button button(String s,Runnable action){Button b=new Button(this);b.setText(s);b.setAllCaps(false);b.setTextColor(0xffdce6ec);b.setTextSize(15);b.setBackground(background(0xff1b3340));b.setMinHeight(dp(52));LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,-2);p.setMargins(0,dp(6),0,dp(6));layout.addView(b,p);b.setOnClickListener(v->action.run());return b;}
    private void open(String url){startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse(url)));}
    private JSONObject post(String path,JSONObject value,boolean auth)throws Exception{Request.Builder b=new Request.Builder().url(BASE+path).post(RequestBody.create(value.toString(),MediaType.get("application/json")));if(auth)b.header("Authorization","Bearer "+PrivateStore.get(this,"token"));try(Response r=http.newCall(b.build()).execute()){JSONObject result=new JSONObject(r.body().string());if(auth&&r.code()==401){PrivateStore.clear(this);throw new Exception(l("اتصال قبلی باطل شده؛ دوباره درخواست بده.","Previous pairing revoked; request a new connection."));}if(!r.isSuccessful()&&!result.has("status"))throw new Exception(result.optString("error","Request failed"));return result;}}
    private void pair(){
        if(busy||paired()||!pairId.isEmpty())return;busy=true;String address=email.getText().toString().trim(),label=name.getText().toString().trim();notice=l("ارسال درخواست…","Requesting pairing…");updateStatus();
        worker.execute(()->{try{JSONObject r=post("/pair/request",new JSONObject().put("email",address).put("name",label).put("model",Build.MANUFACTURER+" "+Build.MODEL).put("installationId",installationId()),false);
            pairId=r.getString("id");pairSecret=r.getString("secret");code=r.getString("code");PrivateStore.put(this,"email",address);PrivateStore.put(this,"pendingId",pairId);PrivateStore.put(this,"pendingSecret",pairSecret);PrivateStore.put(this,"pendingCode",code);
            notice=l("منتظر تأیید حساب گوگل","Waiting for Google approval");ui.post(this::render);
        }catch(Exception e){showError(e);}finally{busy=false;}});
    }
    private void clearPending() throws Exception{pairId="";pairSecret="";code="";for(String k:new String[]{"pendingId","pendingSecret","pendingCode"})PrivateStore.put(this,k,"");}
    private void poll(){if(pairId.isEmpty()||busy)return;try{JSONObject r=post("/pair/claim",new JSONObject().put("id",pairId).put("secret",pairSecret),false);String state=r.optString("status");
        if(state.equals("approved")){PrivateStore.put(this,"token",r.getString("token"));PrivateStore.put(this,"deviceId",r.getString("deviceId"));clearPending();notice="";ui.post(this::render);}
        else if(state.equals("expired")||state.equals("rejected")){clearPending();notice=l("درخواست منقضی یا لغو شد.","Request expired or cancelled.");ui.post(this::render);}
    }catch(Exception ignored){}}
    private void cancel(){if(busy)return;busy=true;command("STOP");notice=l("لغو اتصال سرور…","Cancelling server pairing…");updateStatus();worker.execute(()->{try{if(paired())post("/device/unpair",new JSONObject(),true);else if(!pairId.isEmpty())post("/pair/cancel",new JSONObject().put("id",pairId).put("secret",pairSecret),false);PrivateStore.clear(this);pairId="";pairSecret="";code="";notice="";ui.post(this::render);}catch(Exception e){showError(e);}finally{busy=false;}});}
    private void permissions(boolean camera){if(!paired())return;ArrayList<String> list=new ArrayList<>();if(checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)!=PackageManager.PERMISSION_GRANTED)list.add(Manifest.permission.ACCESS_FINE_LOCATION);if(checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION)!=PackageManager.PERMISSION_GRANTED)list.add(Manifest.permission.ACCESS_COARSE_LOCATION);if(Build.VERSION.SDK_INT>=33&&checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)list.add(Manifest.permission.POST_NOTIFICATIONS);if(camera&&checkSelfPermission(Manifest.permission.CAMERA)!=PackageManager.PERMISSION_GRANTED)list.add(Manifest.permission.CAMERA);if(list.isEmpty())command(camera?"CAMERA_ON":"START");else requestPermissions(list.toArray(new String[0]),camera?22:21);}
    @Override public void onRequestPermissionsResult(int request,String[] permissions,int[] results){super.onRequestPermissionsResult(request,permissions,results);if(request==22&&checkSelfPermission(Manifest.permission.CAMERA)!=PackageManager.PERMISSION_GRANTED){notice=l("مجوز دوربین داده نشد.","Camera permission denied.");updateStatus();return;}command(request==22?"CAMERA_ON":"START");}
    private void command(String action){Intent i=new Intent(this,TelemetryService.class).setAction(action);if(action.equals("STOP")){stopService(i);return;}if(paired())startForegroundService(i);}
    private void saving(){if(!paired())return;command("RELAY");saving=true;WindowManager.LayoutParams p=getWindow().getAttributes();p.screenBrightness=.01f;getWindow().setAttributes(p);TextView black=new TextView(this);black.setBackgroundColor(Color.BLACK);black.setTextColor(Color.DKGRAY);black.setGravity(Gravity.CENTER);black.setText(l("رله فعال است\nبرای بازگشت لمس کن","Relay active\nTap to return"));setContentView(black);black.setOnClickListener(v->{saving=false;WindowManager.LayoutParams q=getWindow().getAttributes();q.screenBrightness=-1;getWindow().setAttributes(q);render();});}
    private void showError(Exception e){ui.post(()->{notice=l("خطا: ","Error: ")+e.getMessage();updateStatus();});}
    @Override protected void onDestroy(){ui.removeCallbacks(refresh);worker.shutdownNow();super.onDestroy();}
}

import userModel from "../../../DB/models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utls/email.js";
import cloudinary from "../../utls/cloudinary.js";
import XLSX from "xlsx";
import WithdrawalModel from "../../../DB/models/withdrawa.model.js";
import VoteModel from "../../../DB/models/vote.model.js";

export const getAdmin = async (req, res, next) => {
    const Admins = await userModel.find({ isDeleted: false , role : 'Admin'});
    return res.status(200).json({ message: "success", Admins });

}

export const getinformation = async (req, res, next) => {
  const userId = req.user;
  const getinformation = await userModel.find({ _id:userId , isDeleted: false });
  return res.status(200).json({ message: "success", getinformation });

}

export const getdeleteAdmin = async (req, res, next) => {
 
  const getinformation = await userModel.find({ role:'Admin' ,isDeleted: true });
  return res.status(200).json({ message: "success", getinformation });

}

export const getdeleteuser = async (req, res, next) => {
  const getinformation = await userModel.find({role:'User' ,isDeleted: true });
  return res.status(200).json({ message: "success", getinformation });

}
export const getdeleteCandidate = async (req, res, next) => {
 
  const getinformation = await userModel.find({ role:'Candidate' ,isDeleted: true });
  return res.status(200).json({ message: "success", getinformation });

}

export const getspesificAdmin = async (req, res, next) => {
    const { AdminID } = req.params;
    const Admin = await userModel.findOne({ _id: AdminID , role : 'Admin'});
    if (!Admin) {
        return res.status(404).json({ message: "Admin not found" });
    }
    return res.status(200).json({ message: "Admin found", Admin });

}


export const softDeletSuperAdmin = async (req, res) => {
  const { id } = req.params;
  
  const user = await userModel.findOneAndUpdate({ _id: id, isDeleted: false, role: 'Admin' }, { isDeleted: true }, { new: true });
  if (!user) {
      return res.status(400).json({ message: "Can't delete this record" });
  }

  return res.status(200).json({ message: `success delete ${user.role}` });
}


export const HarddeleteSuperAdmin = async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findOneAndDelete({ _id: id, isDeleted: true, role: 'Admin' });

  if (!user) {
      return res.status(400).json({ message: "Can't delete this record" });
  }
  return res.status(200).json({ message: `success delete ${user.role}` });
}


export const restoreSuperAdmin = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findOneAndUpdate({ _id: id, isDeleted: true, role: 'Admin' }, { isDeleted: false }, { new: true });
  if (!user) {
      return res.status(400).json({ message: "Admin not found" });
  }
  return res.status(200).json({ message: `success restore ${user.role}` });
}


export const softDeleteAdmin = async (req, res) => {
  const { id } = req.params;
  const AdminId = req.user;
  const user = await userModel.findOne({ _id: id, role: { $in: ['User', 'Candidate'] } });
  if (!user) {
      return res.status(400).json({ message: "Can't delete this record" });
  }
  
  if (user.role === 'Candidate') {
   
      if (AdminId._id.toString() !== user.AdminID.toString()) {
          return res.status(403).json({ message: "Unauthorized action" });
      }
      await userModel.findOneAndUpdate({ _id: id, isDeleted: false, role: 'Candidate' }, { isDeleted: true }, { new: true });
  } 
  
  else {
    
      await userModel.findOneAndUpdate({ _id: id, isDeleted: false, role: 'User' }, { isDeleted: true }, { new: true });
  }

  return res.status(200).json({ message: `Successfully deleted ${user.role}` });
}


export const Harddeleteadmin = async (req, res, next) => {
    const { id } = req.params;
    const AdminId = req.user;
    const user = await userModel.findOne({ _id: id, role: { $in: ['User', 'Candidate'] } });
    if (!user) {
        return res.status(400).json({ message: "Can't delete this record" });
    }
  
    if (user.role === 'Candidate') {
        if (AdminId._id.toString() !== user.AdminID.toString()) {
        
            return res.status(403).json({ message: "Unauthorized action" });
        }
        await userModel.findOneAndDelete({ _id: id, isDeleted: true, role: 'Candidate'  });
    } else {
      await userModel.findOneAndDelete({ _id: id, isDeleted: true, role: 'User'  });
    }
  
    return res.status(200).json({ message: `Successfully deleted ${user.role}` });
}



export const restore = async (req, res) => {
  const { id } = req.params;
  const AdminId = req.user;
  const user = await userModel.findOne({ _id: id, role: { $in: ['User', 'Candidate'] } });
  if (!user) {
      return res.status(400).json({ message: "Can't delete this record" });
  }

  if (user.role === 'Candidate') {
      if (AdminId._id.toString() !== user.AdminID.toString()) {
      
          return res.status(403).json({ message: "Unauthorized action" });
      }
      await userModel.findOneAndUpdate({ _id: id, isDeleted: true, role: 'Candidate' }, { isDeleted:false  }, { new: true });
  } else {
      await userModel.findOneAndUpdate({ _id: id, isDeleted: true, role: 'User' }, { isDeleted: false }, { new: true });
  }

  return res.status(200).json({ message: `Successfully deleted ${user.role}` });
}






export const updateSuperAdmin = async (req, res, next) => {
  const { id } = req.params;
  const admin = await userModel.findOne({ _id: id, role: 'Admin' }); // التحقق من أن المستخدم هو أدمن
  if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
  }

  if (await userModel.findOne({ email: req.body.email, _id: { $ne: id } }).select('email')) {
      return res.status(409).json({ message: `Admin with email ${req.body.email} already exists` });
  }

  if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
          folder: `${process.env.APP_NAME}/Admin`
      });
      if (admin.image && admin.image.public_id) {
          await cloudinary.uploader.destroy(admin.image.public_id);
      }
      admin.image = { secure_url, public_id };
  }

  admin.email = req.body.email || admin.email;
  admin.userName = req.body.userName || admin.userName;
  admin.address = req.body.address || admin.address;
  admin.status = req.body.status || admin.status;
  admin.phone = req.body.phone || admin.phone;

  await admin.save();

  return res.status(200).json({ message: "success", admin });
}



export const updateadmin = async (req, res, next) => {
  
    const { id } = req.params;
    const admin = await userModel.findOne({ _id: id,role: { $in: ['User', 'Candidate'] } } );
    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }
   
    if (await userModel.findOne({ email: req.body.email, _id: { $ne: id } }).select('email')) {
        return res.status(409).json({ message: `${admin.role} ${req.body.email} alredy exists` })
    }
    
    if(req.file){

        if (admin.role === 'Candidate') {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
                folder: `${process.env.APP_NAME}/Candidate`
            })
            cloudinary.uploader.destroy(admin.image.public_id);
            admin.image={ secure_url, public_id };
        }

    else  if (admin.role === 'User') {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APP_NAME}/users`
        })
        cloudinary.uploader.destroy(admin.image.public_id);
        admin.image={ secure_url, public_id };
    }
        
    }
    
    admin.email = req.body.email || admin.email;
    admin.userName = req.body.userName || admin.userName;
    admin.address = req.body.address || admin.address;
    admin.statuse = req.body.statuse || admin.statuse;
    admin.phone = req.body.phone || admin.phone;
   
    await admin.save();
 
    return res.status(200).json({ message: "success", admin });

}


export const updateProfile = async (req, res, next) => {
  const  id  = req.user._id;
  const admin = await userModel.findOne({ _id: id });
  if (!admin) {
      return res.status(404).json({ message: `${user.role} not found` });
  }
  if (await userModel.findOne({ email: req.body.email, _id: { $ne: id } }).select('email')) {
      return res.status(409).json({ message: `${admin.role} ${req.body.email} alredy exists` })
  }
  
  if(req.file){

      if (admin.role === 'Candidate') {
          const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
              folder: `${process.env.APP_NAME}/Candidate`
          })
          cloudinary.uploader.destroy(admin.image.public_id);
          admin.image={ secure_url, public_id };
      }

   else if (admin.role === 'Admin') {
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
          folder: `${process.env.APP_NAME}/Admin`
      })
      cloudinary.uploader.destroy(admin.image.public_id);
      admin.image={ secure_url, public_id };
  }

  else {
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
          folder: `${process.env.APP_NAME}/users`
      })
      cloudinary.uploader.destroy(admin.image.public_id);
      admin.image={ secure_url, public_id };
  }
      
  }
  admin.email = req.body.email || admin.email;
  admin.userName = req.body.userName || admin.userName;
  admin.address = req.body.address || admin.address;
  admin.statuse = req.body.statuse || admin.statuse;
  admin.phone = req.body.phone || admin.phone;
   
  await admin.save();
  return res.status(200).json({ message: "success", admin });

}




export const addCandidateExcel = async (req, res, next) => {
  try {
    const AdminId = req.user;
    // تأكد من وجود المفتاح السري في متغيرات البيئة
    if (!process.env.CONFTRAMEMAILSECRET) {
  
      throw new Error("CONFTRAMEMAILSECRET must have a value");
    }
    const workBook = XLSX.readFile(req.file.path);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const users = XLSX.utils.sheet_to_json(workSheet);

    const errors = [];
    const successes = [];
    const email = [];
    for (const row of users) {
      const { userName, email, password, cardnumber, phone, address, gender, role = 'Candidate' } = row;
      // التحقق من أن دور المستخدم هو مرشح
      if (role !== 'Candidate') {
        errors.push({ message: "Role must be 'Candidate'", email, userName });
        continue;
      }
      // التحقق من عدم وجود الحسابات بالفعل
      if (await userModel.findOne({ email })) {
        errors.push({ message: "Email already exists", email });
        continue;
      }
      if (await userModel.findOne({ phone })) {
        errors.push({ message: "Phone already exists", phone });
        continue;
      }
      if (await userModel.findOne({ cardnumber })) {
        errors.push({ message: "Card number already exists", cardnumber });
        continue;
      }

      // تشفير كلمة المرور وإنشاء توكن تأكيد البريد الإلكتروني
      const passwordString = String(password);
      const hashedPassword = await bcrypt.hash(passwordString, parseInt(process.env.SALT_ROUND));
      const token = jwt.sign({ email }, process.env.CONFTRAMEMAILSECRET);

      // إرسال بريد تأكيد البريد الإلكتروني
      const html = `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Confirm Your Email</title>
          <style>
            body {
              font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
              padding: 0;
              margin: 0;
              background-color: #FAFAFA;
            }
            .wrapper {
              width: 100%;
              padding: 0;
              margin: 0;
            }
            .content {
              width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header img {
              width: 200px;
            }
            .content h1 {
              font-size: 46px;
              color: #333333;
            }
            .content p {
              font-size: 14px;
              color: #333333;
              line-height: 21px;
            }
            .button {
              display: inline-block;
              background-color: #5C68E2;
              color: #FFFFFF;
              padding: 10px 30px;
              border-radius: 6px;
              text-decoration: none;
              font-size: 20px;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="content">
              <div class="header">
                <img src="https://your-logo-url/logo.png" alt="Logo">
              </div>
              <h1>Confirm Your Email</h1>
              <p>You’ve received this message because your email address has been registered with our site. Please click the button below to verify your email address and confirm that you are the owner of this account.</p>
              <a href='${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}' class="button">CONFIRM YOUR EMAIL</a>
              <p>If you did not register with us, please disregard this email.</p>
              <p>Once confirmed, this email will be uniquely associated with your account.</p>
            </div>
          </div>
        </body>
        </html>`;

      try {
        await sendEmail(email, "Confirm Your Email", html);
        // إضافة المستخدم بعد إرسال البريد الإلكتروني بنجاح
        const createUser = await userModel.create({ userName, email, password: hashedPassword, cardnumber, phone, address, gender, role,AdminID:AdminId,
          image: {
            secure_url: 'https://drive.google.com/file/d/1-Dp4LJv73Z-aFyLUJRb1kiMtdVyeuHmn/view?usp=sharing',
          },
        });
        successes.push(createUser.userName);
      } catch (emailError) {
        errors.push({ message: "Failed to send confirmation email", email, error: emailError.message });
      }
    }

    return res.status(200).json({  message: "Candidate import completed",  successes,  errors,});

  } catch (error) {
    console.error("Error while uploading candidates:", error);
    return res.status(500).json({ message: "Error while uploading candidates", error: error.message });
  }
};




export const updatPassword = async (req, res, next) => {
    const {oldPassword,newPassword}=req.body;
    const user = await userModel.findById(req.user._id);
    const match =bcrypt.compareSync(oldPassword,user.password);
    
    if(!match){
        return next(new Error(`invalid old password`));
    }
    const match2 =bcrypt.compareSync(oldPassword,newPassword);
    
    if(match2){
        return next(new Error(` old password sem new password`));
    }
    const hashPassword=bcrypt.hashSync(newPassword,parseInt(process.env.SALTROUND));
    user.password=hashPassword;
    user.save();
    return res.status(200).json({message:"Password successfully changed"});
    }


    

    export const UpdateStatuseUser = async (req, res, next) => {
      const { idUser } = req.params;
      const User = await userModel.findOne({ _id: idUser });
      if (!User) {
          return res.status(404).json({ message: `${User.id} not found` });
      }
 
      if (User.statuse === 'Inactive') {
        User.statuse = 'Active';
       // const token = jwt.sign({ email }, process.env.CONFTRAMEMAILSECRET);
        const token = jwt.sign({ email: User.email }, process.env.CONFTRAMEMAILSECRET);
        //const html=`<a href='${req.protocol}://${req.headers.host}/auth/confimEmail/${token}'>verify</a>`;
        const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
       <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>New message 2</title><!--[if (mso 16)]>
          <style type="text/css">
          a {text-decoration: none;}
          </style>
          <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
      <xml>
          <o:OfficeDocumentSettings>
          <o:AllowPNG></o:AllowPNG>
          <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
        <style type="text/css">
      #outlook a {
          padding:0;
      }
      .es-button {
          mso-style-priority:100!important;
          text-decoration:none!important;
      }
      a[x-apple-data-detectors] {
          color:inherit!important;
          text-decoration:none!important;
          font-size:inherit!important;
          font-family:inherit!important;
          font-weight:inherit!important;
          line-height:inherit!important;
      }
      .es-desk-hidden {
          display:none;
          float:left;
          overflow:hidden;
          width:0;
          max-height:0;
          line-height:0;
          mso-hide:all;
      }
      @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:36px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:20px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
      </style>
       </head>
       <body bis_status="ok" bis_frame_id="82" style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
        <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FAFAFA"><!--[if gte mso 9]>
                  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                      <v:fill type="tile" color="#fafafa"></v:fill>
                  </v:background>
              <![endif]-->
         <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
           <tr>
            <td valign="top" style="padding:0;Margin:0">
             <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
               <tr>
                <td class="es-info-area" align="center" style="padding:0;Margin:0">
                 <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" bgcolor="#FFFFFF" role="none">
                   <tr>
                    <td align="left" style="padding:20px;Margin:0">
                     <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                         <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                            <td align="center" class="es-infoblock" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:14px;color:#CCCCCC;font-size:12px"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px">View online version</a></p></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table></td>
               </tr>
             </table>
             <table cellpadding="0" cellspacing="0" class="es-header" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
               <tr>
                <td align="center" style="padding:0;Margin:0">
                 <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
                   <tr>
                    <td align="left" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:20px;padding-right:20px">
                     <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:560px">
                         <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                            <td align="center" style="padding:0;Margin:0;padding-bottom:20px;font-size:0px"><img src="https://fbiegpp.stripocdn.email/content/guids/CABINET_887f48b6a2f22ad4fb67bc2a58c0956b/images/93351617889024778.png" alt="Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;font-size:12px" width="200" title="Logo"></td>
                           </tr>
                           <tr>
                            <td style="padding:0;Margin:0">
                             <table cellpadding="0" cellspacing="0" width="100%" class="es-menu" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                               <tr class="links">
                                <td align="center" valign="top" width="25%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#666666;font-size:14px">Shop</a></td>
                                <td align="center" valign="top" width="25%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#666666;font-size:14px">New</a></td>
                                <td align="center" valign="top" width="25%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#666666;font-size:14px">Sale</a></td>
                                <td align="center" valign="top" width="25%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#666666;font-size:14px">About</a></td>
                               </tr>
                             </table></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table></td>
               </tr>
             </table>
             <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
               <tr>
                <td align="center" style="padding:0;Margin:0">
                 <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                   <tr>
                    <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px">
                     <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                         <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                            <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0px"><img src="https://fbiegpp.stripocdn.email/content/guids/CABINET_67e080d830d87c17802bd9b4fe1c0912/images/55191618237638326.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="100"></td>
                           </tr>
                           <tr>
                            <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-bottom:10px"><h1 style="Margin:0;line-height:46px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:46px;font-style:normal;font-weight:bold;color:#333333">Confirm Your Email</h1></td>
                           </tr>
                           <tr>
                            <td align="center" class="es-m-p0r es-m-p0l" style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">You’ve received this message because your email address has been registered with our site. Please click the button below to verify your email address and confirm that you are the owner of this account.</p></td>
                           </tr>
                           <tr>
                            <td align="center" style="padding:0;Margin:0;padding-bottom:5px;padding-top:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">If you did not register with us, please disregard this email.</p></td>
                           </tr>
                           <tr>
                            <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><!--[if mso]><a href='${req.protocol}://${req.headers.host}/auth/confimEmail/${token}' target="_blank" hidden>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href='${req.protocol}://${req.headers.host}/auth/confimEmail/${token}'
                      style="height:44px; v-text-anchor:middle; width:300px" arcsize="14%" stroke="f"  fillcolor="#5c68e2">
              <w:anchorlock></w:anchorlock>
              <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:18px; font-weight:400; line-height:18px;  mso-text-raise:1px'>CONFIRM YOUR EMAIL</center>
          </v:roundrect></a>
      <![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#5C68E2;border-width:0px;display:inline-block;border-radius:6px;width:auto;mso-hide:all"><a href='${req.protocol}://${req.headers.host}/auth/confimEmail/${token}' class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:20px;padding:10px 30px 10px 30px;display:inline-block;background:#5C68E2;border-radius:6px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:24px;width:auto;text-align:center;mso-padding-alt:0;mso-border-alt:10px solid #5C68E2;padding-left:30px;padding-right:30px">CONFIRM YOUR EMAIL</a></span><!--<![endif]--></td>
                           </tr>
                           <tr>
                            <td align="center" class="es-m-p0r es-m-p0l" style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Once confirmed, this email will be uniquely associated with your account.</p></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table></td>
               </tr>
             </table>
             <table cellpadding="0" cellspacing="0" class="es-footer" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
               <tr>
                <td align="center" style="padding:0;Margin:0">
                 <table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:640px" role="none">
                   <tr>
                    <td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px">
                     <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td align="left" style="padding:0;Margin:0;width:600px">
                         <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                            <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;font-size:0">
                             <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                               <tr>
                                <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><img title="Facebook" src="https://fbiegpp.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" alt="Fb" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                                <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><img title="Twitter" src="https://fbiegpp.stripocdn.email/content/assets/img/social-icons/logo-black/twitter-logo-black.png" alt="Tw" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                                <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><img title="Instagram" src="https://fbiegpp.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" alt="Inst" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                                <td align="center" valign="top" style="padding:0;Margin:0"><img title="Youtube" src="https://fbiegpp.stripocdn.email/content/assets/img/social-icons/logo-black/youtube-logo-black.png" alt="Yt" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                               </tr>
                             </table></td>
                           </tr>
                           <tr>
                            <td align="center" style="padding:0;Margin:0;padding-bottom:35px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;color:#333333;font-size:12px">Style Casual&nbsp;© 2021 Style Casual, Inc. All Rights Reserved.</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;color:#333333;font-size:12px">4562 Hazy Panda Limits, Chair Crossing, Kentucky, US, 607898</p></td>
                           </tr>
                           <tr>
                            <td style="padding:0;Margin:0">
                             <table cellpadding="0" cellspacing="0" width="100%" class="es-menu" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                               <tr class="links">
                                <td align="center" valign="top" width="33.33%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:5px;padding-bottom:5px;border:0"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#999999;font-size:12px">Visit Us </a></td>
                                <td align="center" valign="top" width="33.33%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:5px;padding-bottom:5px;border:0;border-left:1px solid #cccccc"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#999999;font-size:12px">Privacy Policy</a></td>
                                <td align="center" valign="top" width="33.33%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:5px;padding-bottom:5px;border:0;border-left:1px solid #cccccc"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#999999;font-size:12px">Terms of Use</a></td>
                               </tr>
                             </table></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table></td>
               </tr>
             </table>
             <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
               <tr>
                <td class="es-info-area" align="center" style="padding:0;Margin:0">
                 <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" bgcolor="#FFFFFF" role="none">
                   <tr>
                    <td align="left" style="padding:20px;Margin:0">
                     <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                         <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                            <td align="center" class="es-infoblock" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:14px;color:#CCCCCC;font-size:12px"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a>No longer want to receive these emails?&nbsp;<a href="" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px">Unsubscribe</a>.<a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a></p></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table></td>
               </tr>
             </table></td>
           </tr>
         </table>
        </div>
       </body>
      </html>
      
      `
      await sendEmail(User.email, "Confirm Email", html);
        
      } else if (User.statuse === 'Active') {
        User.statuse = 'Inactive';

      }
    
      await User.save();
      return res.status(200).json({ message: "success", User });
  
  }



  export const getUserActive = async (req, res, next) => {
    const Users = await userModel.find({ isDeleted: false, statuse:'Active', role : 'User'});
    return res.status(200).json({ message: "success", Users });

}


export const getallUser = async (req, res, next) => {
  const Users = await userModel.find({ isDeleted: false, role : 'User'});
  return res.status(200).json({ message: "success", Users });

}
  

  
export const getspesificUser = async (req, res, next) => {
  const { UserID } = req.params;
  const User = await userModel.findOne({ _id: UserID , role : 'User'});
  if (!User) {
      return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ message: "User found", User });

}



export const manageWithdrawalRequest = async (req, res) => {

      const { requestId } = req.params; // معرف طلب الانسحاب
      const { status } = req.body; // الحالة الجديدة المراد تحديثها
      const Admin_id = req.user._id; 
     
      // التحقق من صحة الحالة
      const validStatuses = ['Pending', 'Approved', 'Rejected'];
      if (!validStatuses.includes(status)) {
          return res.status(400).json({  message: "Invalid status. Must be one of: 'Pending', 'Approved', 'Rejected'" });
      }

      // تحديث طلب الانسحاب بالحالة الجديدة
      const updatedRequest = await WithdrawalModel.findByIdAndUpdate(requestId, { status }, { new: true });
      if (Admin_id.toString() !== updatedRequest.AdminID.toString()) {
        return res.status(403).json({ message: "Unauthorized action" });
      }

      if (!updatedRequest) {
          return res.status(404).json({ message: "Withdrawal request not found" });
      }

      // إذا تم قبول الطلب، قم بإزالة المرشح من قائمة المرشحين في التصويت
      if (status === 'Approved') {
          await VoteModel.findByIdAndUpdate(updatedRequest.voteId, {
              $pull: { candidates: updatedRequest.candidateId }
          });
      }

      res.status(200).json({ message: `Withdrawal request ${status.toLowerCase()} successfully`, updatedRequest });

};




export const withdrawals = async (req, res) => {
  const Admin_id = req.user._id; 
  // Fetch withdrawals with associated vote and candidate information
  const withdrawals = await WithdrawalModel.find({AdminID:Admin_id, status: 'Pending' })
      .populate({
          path: 'voteId', // Use the correct field name in WithdrawalModel
          select: 'voteName' // Assuming the 'voteName' field represents the vote name
      })
      .populate({
          path: 'candidateId', // Use the correct field name in WithdrawalModel
          select: 'userName' // Assuming the 'userName' field represents the candidate name
      });




  return res.status(200).json({ message: "success", withdrawals });
};


export const Role = async (req, res) => {
  const userId = req.user;

  return res.status(200).json({ role:userId.role});


}



export const Signup = async (req, res, next) => {
  const AdminId = req.user;
  const { userName, email, password, cardnumber, phone, address, gender, role='User' } = req.body;

  if (await userModel.findOne({ email })) {
      return next(new Error("email already exists", { cause: 409 }));
  }
  if (await userModel.findOne({ phone })) {
      return next(new Error("phone already exists", { cause: 409 }));
  }
  if (await userModel.findOne({ cardnumber })) {
      return next(new Error("cardnumber already exists", { cause: 409 }));
  }
  const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));
  let imageUploadFolder = '';
  // تحديد مجلد الرفع حسب دور المستخدم
  if (role === 'Candidate') {
      imageUploadFolder = `${process.env.APP_NAME}/Candidates`;
  } else if (role === 'Admin') {
      imageUploadFolder = `${process.env.APP_NAME}/Admins`;
  } else {
      imageUploadFolder = `${process.env.APP_NAME}/Users`;
  }
  // رفع الصورة إلى Cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: imageUploadFolder
  });

  const statuse = role === 'User' ? 'Inactive' : 'Active';
  const createUser = await userModel.create({ userName, email, password: hashedPassword, statuse,cardnumber, phone, address, gender, role, image: { secure_url, public_id },AdminID:AdminId });

  //if (role === 'Admin' || role === 'Candidate') {
  const token = jwt.sign({ email }, process.env.CONFTRAMEMAILSECRET);

  //const html=`<a href='${req.protocol}://${req.headers.host}/auth/confimEmail/${token}'>verify</a>`;
  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
 <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>New message 2</title><!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
<xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG></o:AllowPNG>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <style type="text/css">
#outlook a {
    padding:0;
}
.es-button {
    mso-style-priority:100!important;
    text-decoration:none!important;
}
a[x-apple-data-detectors] {
    color:inherit!important;
    text-decoration:none!important;
    font-size:inherit!important;
    font-family:inherit!important;
    font-weight:inherit!important;
    line-height:inherit!important;
}
.es-desk-hidden {
    display:none;
    float:left;
    overflow:hidden;
    width:0;
    max-height:0;
    line-height:0;
    mso-hide:all;
}
@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:36px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:20px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
</style>
 </head>
 <body bis_status="ok" bis_frame_id="82" style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FAFAFA"><!--[if gte mso 9]>
            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                <v:fill type="tile" color="#fafafa"></v:fill>
            </v:background>
        <![endif]-->
   <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
     <tr>
      <td valign="top" style="padding:0;Margin:0">
       <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
         <tr>
          <td class="es-info-area" align="center" style="padding:0;Margin:0">
           <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" bgcolor="#FFFFFF" role="none">
             <tr>
              <td align="left" style="padding:20px;Margin:0">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" class="es-infoblock" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:14px;color:#CCCCCC;font-size:12px"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px">View online version</a></p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" class="es-header" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
             <tr>
              <td align="left" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:20px;padding-right:20px">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-bottom:20px;font-size:0px"><img src="https://fbiegpp.stripocdn.email/content/guids/CABINET_887f48b6a2f22ad4fb67bc2a58c0956b/images/93351617889024778.png" alt="Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;font-size:12px" width="200" title="Logo"></td>
                     </tr>
                     <tr>
                      <td style="padding:0;Margin:0">
                       <table cellpadding="0" cellspacing="0" width="100%" class="es-menu" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr class="links">
                          <td align="center" valign="top" width="25%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#666666;font-size:14px">Shop</a></td>
                          <td align="center" valign="top" width="25%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#666666;font-size:14px">New</a></td>
                          <td align="center" valign="top" width="25%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#666666;font-size:14px">Sale</a></td>
                          <td align="center" valign="top" width="25%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#666666;font-size:14px">About</a></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
             <tr>
              <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0px"><img src="https://fbiegpp.stripocdn.email/content/guids/CABINET_67e080d830d87c17802bd9b4fe1c0912/images/55191618237638326.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="100"></td>
                     </tr>
                     <tr>
                      <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-bottom:10px"><h1 style="Margin:0;line-height:46px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:46px;font-style:normal;font-weight:bold;color:#333333">Confirm Your Email</h1></td>
                     </tr>
                     <tr>
                      <td align="center" class="es-m-p0r es-m-p0l" style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">You’ve received this message because your email address has been registered with our site. Please click the button below to verify your email address and confirm that you are the owner of this account.</p></td>
                     </tr>
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-bottom:5px;padding-top:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">If you did not register with us, please disregard this email.</p></td>
                     </tr>
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><!--[if mso]><a href='${req.protocol}://${req.headers.host}/auth/confimEmail/${token}' target="_blank" hidden>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href='${req.protocol}://${req.headers.host}/auth/confimEmail/${token}'
                style="height:44px; v-text-anchor:middle; width:300px" arcsize="14%" stroke="f"  fillcolor="#5c68e2">
        <w:anchorlock></w:anchorlock>
        <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:18px; font-weight:400; line-height:18px;  mso-text-raise:1px'>CONFIRM YOUR EMAIL</center>
    </v:roundrect></a>
<![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#5C68E2;border-width:0px;display:inline-block;border-radius:6px;width:auto;mso-hide:all"><a href='${req.protocol}://${req.headers.host}/auth/confimEmail/${token}' class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:20px;padding:10px 30px 10px 30px;display:inline-block;background:#5C68E2;border-radius:6px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:24px;width:auto;text-align:center;mso-padding-alt:0;mso-border-alt:10px solid #5C68E2;padding-left:30px;padding-right:30px">CONFIRM YOUR EMAIL</a></span><!--<![endif]--></td>
                     </tr>
                     <tr>
                      <td align="center" class="es-m-p0r es-m-p0l" style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Once confirmed, this email will be uniquely associated with your account.</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" class="es-footer" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:640px" role="none">
             <tr>
              <td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:600px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;font-size:0">
                       <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><img title="Facebook" src="https://fbiegpp.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" alt="Fb" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                          <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><img title="Twitter" src="https://fbiegpp.stripocdn.email/content/assets/img/social-icons/logo-black/twitter-logo-black.png" alt="Tw" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                          <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><img title="Instagram" src="https://fbiegpp.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" alt="Inst" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                          <td align="center" valign="top" style="padding:0;Margin:0"><img title="Youtube" src="https://fbiegpp.stripocdn.email/content/assets/img/social-icons/logo-black/youtube-logo-black.png" alt="Yt" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                         </tr>
                       </table></td>
                     </tr>
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-bottom:35px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;color:#333333;font-size:12px">Style Casual&nbsp;© 2021 Style Casual, Inc. All Rights Reserved.</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;color:#333333;font-size:12px">4562 Hazy Panda Limits, Chair Crossing, Kentucky, US, 607898</p></td>
                     </tr>
                     <tr>
                      <td style="padding:0;Margin:0">
                       <table cellpadding="0" cellspacing="0" width="100%" class="es-menu" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr class="links">
                          <td align="center" valign="top" width="33.33%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:5px;padding-bottom:5px;border:0"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#999999;font-size:12px">Visit Us </a></td>
                          <td align="center" valign="top" width="33.33%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:5px;padding-bottom:5px;border:0;border-left:1px solid #cccccc"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#999999;font-size:12px">Privacy Policy</a></td>
                          <td align="center" valign="top" width="33.33%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:5px;padding-bottom:5px;border:0;border-left:1px solid #cccccc"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#999999;font-size:12px">Terms of Use</a></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
         <tr>
          <td class="es-info-area" align="center" style="padding:0;Margin:0">
           <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" bgcolor="#FFFFFF" role="none">
             <tr>
              <td align="left" style="padding:20px;Margin:0">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" class="es-infoblock" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:14px;color:#CCCCCC;font-size:12px"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a>No longer want to receive these emails?&nbsp;<a href="" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px">Unsubscribe</a>.<a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a></p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table></td>
     </tr>
   </table>
  </div>
 </body>
</html>

`

  await sendEmail(email, "confirm email", html)

  //}

  
  return res.status(201).json({ message: "success", createUser });

}

import tkinter
import base64
import sys
import random
from tkinter import *
from tkinter import messagebox
import re
import base64

chance=5
truefalse=0
word = ""
finalword = ""      
array_input = ''
array_input_int = 1 #boolean value for comparison true for 1
array_input_increment = 0
word_length = len(word)
value = word_length
guistarting = 1;

def makinghangman(truefalse):
    if(truefalse==1):
        createhead = w.create_oval(100,140,140,170,outline="white")
    if(truefalse==2):
        chestline = w.create_line(120,170,120,205,fill="white")
        leftleg = w.create_line(120,205,100,225,fill="white")
    if(truefalse==3):
        rightleg = w.create_line(120,205,140,225,fill="white")
    if(truefalse==4):
        lefthand = w.create_line(120,175,100,195,fill="white")
    if(truefalse==5):
        righthand = w.create_line(120,175,140,195,fill="white")
    
    

def resetclear (selection):
    mText.config(state=NORMAL)
    global chance, word, finalword
    global truefalse, value, array_input, array_input_int, array_input_increment, word_length
    mText.delete(1.0,END)
    chance=5
    truefalse=0
    w.delete("all")
    whiteline = w.create_line(40,250,40,100,fill="white")
    whiteline = w.create_line(0,250,80,250,fill="white")
    whiteline = w.create_line(40,100,120,100,fill="white")
    whiteline = w.create_line(120,100,120,140,fill="white")
        
    if(selection=='Country'):
            array_word=['INDIA','AUSTRALIA','ENGLAND']
    elif(selection=='Religion'):
            array_word=['HINDU','MUSLIM','CHRISTIAN','SIKH']
    elif(selection=='Car Model'):
            array_word=['MARUTI','RENAULT','HONDA','HYUNDAI','TESLA']
    else:
            messagebox.showinfo('Hangman Error','Please select an Option')
            return
    word = random.choice(array_word)
    finalword = ""
    for finallist in range(0,len(word),1):
            finalword += "_"         
    array_input = ''
    array_input_int = 1 #boolean value for comparison true for 1
    array_input_increment = 0
    word_length = len(word)
    value = word_length
    chances_left.set('5')
    create_word()

def create_word():
        tempstr = ""
        for temp in range(0,len(word),1):
            tempstr += "_ "
        mText.insert(INSERT,tempstr)
        mText.config(state=DISABLED)

def display (finalword , word_length):
    mText.insert(INSERT,'display k andar')
    mText.delete(1.0,END)
    for display in range(0,word_length, 1):
        mText.insert(INSERT,finalword[display])
        mText.insert(INSERT , ' ')

def mHello():
    mText.config(state=NORMAL)

    global chance, word, finalword
    global truefalse, value, array_input, array_input_int, array_input_increment, word_length
    inputletter=ment.get()
    array_input_int = 1
    if len(inputletter)!=1:
            messagebox.showinfo('Hangman Error','Invalid input')
        
    elif not re.match('^[a-zA-Z0-9_]+$', inputletter):
        messagebox.showinfo('Hangman Error','Invalid input')
        array_input_int = 0
    else:
        if inputletter in array_input:
            messagebox.showinfo('Hangman Error','Already in used')
            #print('Already in used')
            array_input_int = 0
        elif(array_input_int==1 and (inputletter not in word)) :
                if truefalse < 4:
                    messagebox.showinfo('Hangman Error','Wrong keyword')
                truefalse += 1
                makinghangman(truefalse)
                chances_left.set(5-truefalse)
        else:
            inte=0
            count=word.count(inputletter)  #count means number of character in string.For ex: S ccomes 2 times in BOSS
            for i in range(0,count):
                value-=1
                inte = re.search(inputletter,word).start()
                temporary_finalword = list(finalword)
                temporary_finalword[inte]=inputletter
                finalword = ''.join(temporary_finalword)   #str1 = ''.join(list1)
                temporary_word = list(word)
                temporary_word[inte]='@'
                word = ''.join(temporary_word)
            display(finalword, word_length)
    array_input+=inputletter
    mEntry.delete(0,END)
    mText.config(state=DISABLED)
    if(truefalse<chance and value==0):
        result=messagebox.askyesno('Congrats','Successfull Attempt. Do you wish to continue ?')
        if result==True:
                print(option_selected.get())
                resetclear(option_selected.get())
        else:
                exit()
    elif(truefalse>chance-1 and value>0):
        result=messagebox.askyesno('Hangman Error','Unsuccessfull Attempt. Do you wish to continue ?')
        if result==True:
                resetclear(option_selected.get())
        else:
                exit()

def start():
        resetclear(option_selected.get())

top=tkinter.Tk();
ment=StringVar();

selectbase64 = b'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'
decodedselect = base64.decodestring(selectbase64)
image_result_for_select = PhotoImage(data=decodedselect)

startbase64 = b'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\nMTcrMDE6MDD+JUn/AAAAAElFTkSuQmCC'
decodedstart = base64.decodestring(startbase64)
image_result_for_start = PhotoImage(data=decodedstart)

submitbase64 = b'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'
decodesubmit = base64.decodestring(submitbase64)
image_result_for_submit = PhotoImage(data=decodesubmit)
chances_left = StringVar();
option_selected=StringVar();
option=OptionMenu(top,option_selected,"Country","Religion","Car Model")
option.config(image = image_result_for_select,indicatoron=0,borderwidth=0)
option.grid(row=0,column=2)
mLabel4=Label(top,bg="white",text='Select your option').grid(row=0,column=0)
mButton2=Button(top,text='Start',command=start,borderwidth=0)
mButton2.config(image = image_result_for_start)
mButton2.grid(row=1,column=1)
mText=Text(top,height=3,width=30,padx=80, pady=30,bg="ghostwhite")
top.geometry("700x350")
top.configure(bg="white")
mLabel=Label(top,bg="white",text='Your Entry')
mEntry=Entry(top,textvariable=ment,bg="lavender")
mButton=Button(top,text='OK',command=mHello,borderwidth=0)
mButton.config(image = image_result_for_submit)
w = Canvas(top,width=300,height=345,bg="black")
mLabel.grid(row=2, column=0)
mText.grid(row=4,column=0, columnspan=3,rowspan=5)
#mText.tag_config("start",background="black",foreground="white")
mEntry.grid(row=2, column=2)
mButton.grid(row=3, column=1)
mLabel2=Label(top,bg="white",text='Attempts left').grid(row=9,column=0)
mLabel3=Label(top,bg="white",textvariable=chances_left).grid(row=9,column=2)

w.grid(row=0,column=3, columnspan=10,rowspan=10)
chances_left.set('5')

"""Build the two public checklists from reviewed copy. No network access."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'public/downloads'
REVIEWED = 'Reviewed November 6, 2026'

BUDGET = [
 ('Check the USB-C cable before buying a charger', 'Match the cable power rating to the laptop and charger. Charging wattage does not prove video or fast-data support. Read the exact cable specifications; no cable guarantees full-speed charging on every device.'),
 ('Choose a repair kit for the fasteners you actually have', 'Check screw types, bit sizes, opening tools, and the device service manual. Disconnect power and follow battery precautions. A larger bit count is not evidence of better quality.'),
 ('Check outlet and surge-protector ratings', 'Compare the simultaneous load with the marked rating. Stop using hot, melted, loose or damaged plugs and cords. Do not daisy-chain strips or treat an extension cord as permanent wiring.'),
 ('Check the host before choosing a USB-C hub', 'Confirm native video support, display limits, operating system, and charging requirements. DisplayLink is a separate software-based USB graphics option. A bigger port count alone does not prove compatibility.'),
 ('Match a drive adapter to the drive', 'Confirm SATA versus NVMe, size, connector and power requirements. A 3.5-inch SATA hard drive generally needs a powered adapter or dock. Do not initialize or format a drive that contains files you need.'),
 ('Clean screens using the device instructions', 'Power the device off, use the manufacturer-approved cloth and cleaner, and avoid spraying liquid into openings. No cloth or cleaner is universally safe for every coating.'),
 ('Measure before buying a stand', 'Check device weight, dimensions, case clearance, stability and the height you need. A stand that fits the product listing may still block a port or put the screen in the wrong place.'),
 ('Verify USB audio support', 'Check operating-system and console compatibility, microphone input support and connector wiring. An inexpensive USB adapter is not guaranteed to work on every console or headset.'),
 ('Check adapter direction and data speed', 'A connector-shape adapter does not create video, charging or bandwidth support. Confirm the direction and supported functions for the exact host, peripheral and cable combination.'),
 ('Choose lighting for the space', 'Measure clamp clearance, monitor clearance and cable reach. Look for suitable brightness and adjustment; check whether the product can be used safely near your equipment.'),
 ('Check card capacity, speed class and device support', 'Use the camera, console or device maker\'s supported-card requirements. Keep a second copy of important files. A brand name alone is not proof of compatibility or reliability.'),
 ('Test the camera you own before replacing it', 'Check app permissions, USB connection, lighting and the app\'s selected camera. For a replacement, verify the exact model, operating system and supported modes. No webcam works in every app without setup.'),
]
LAB = [
 ('Start with the computer you own', 'Check hardware requirements and available disk/RAM for one small disposable VM. Back up important host files before changing storage or firmware settings. Follow the current virtualization and evaluation-license documentation.'),
 ('Separate practice from real data', 'Use disposable VMs, spare drives or a spare machine for drills. Label disks clearly. Never practice deletion, partitioning or restoration on a daily-use computer or the only copy of anything important.'),
 ('Build an isolated practice network', 'Prefer a host-only or deliberately isolated virtual network for DHCP, DNS and domain experiments. Do not bridge a practice DHCP server onto a home or workplace LAN. Record which adapter reaches which network.'),
 ('Add storage only for a specific requirement', 'Choose an external drive or adapter only after checking interface, capacity and power requirements. One external drive is not a complete backup strategy. Verify another independent copy of important files.'),
 ('Verify remote access before hardening SSH', 'Use a local console as a recovery path. Create and verify a separate key-authenticated session before disabling password login. Check that the intended administrator can still connect; keep the console open until tested.'),
 ('Test power protection without risking working data', 'Choose UPS capacity from the actual load and manufacturer guidance. Practice shutdown integration on a disposable system first. Keep printers, heaters and other unsuitable loads off battery-backed outlets.'),
 ('Restore a disposable VM, not your laptop', 'Create a disposable VM with test files. Back it up to a different target, verify that backup and bootable recovery media, and restore into a second disposable VM or spare virtual disk. Compare the restored files before trying any destructive exercise.'),
 ('Practice DNS failures inside the VM', 'Snapshot the VM and record its working network settings. Change only that VM\'s DNS configuration, then inspect address, gateway and DNS results. Restore the known-good settings and verify resolution afterward.'),
 ('Practice permissions with invented users and files', 'Create test accounts and dummy folders in the lab. Record expected access before changing permissions, test allowed and denied cases, and restore the baseline. Never use real customer or employer data.'),
 ('Keep a ticket for each drill', 'Write the symptom, reproduction, expected result, diagnosis, change, validation and rollback. Include actual output only when you captured it. Redact credentials, private addresses and personal information before publishing.'),
 ('Buy the next device when a measured limit blocks you', 'Do not buy a rack, NAS, managed switch or faster network merely to start. Measure RAM, storage and network needs first. VLAN practice may justify a managed switch later; the skill comes before the shopping list.'),
 ('Finish with a working baseline', 'Undo the intentional break, check networking and services, confirm backups and recovery access, and record remaining faults honestly. A screenshot of a dashboard is not proof that restoration or access controls work.'),
]

def footer(c, page, web):
 c.setStrokeColor(HexColor('#cccccc'));c.line(44,44,568,44)
 c.setFillColor(HexColor('#444444'));c.setFont('Helvetica',8)
 c.drawString(44,31,f'StackGeist | {REVIEWED} | {page}/2')
 c.drawRightString(568,31,web)

def build(filename,title,intro,items,sources,web):
 c=canvas.Canvas(str(DEST/filename),pagesize=(612,792))
 c.setTitle(title);c.setAuthor('Keith Casko / StackGeist');c.setSubject('Practical checklist; specifications and availability must be checked at the source.')
 for page in [1,2]:
  c.setFillColor(HexColor('#111111'));c.setFont('Helvetica-Bold',10);c.drawString(44,753,'STACKGEIST')
  c.setFont('Helvetica-Bold',19);c.drawString(44,723,title)
  c.setFont('Helvetica',9);y=703
  for line in simpleSplit(intro,'Helvetica',9,524):c.drawString(44,y,line);y-=12
  y-=13
  for i,(heading,body) in enumerate(items[(page-1)*6:page*6],start=(page-1)*6+1):
   c.setFont('Helvetica-Bold',10);c.setFillColor(HexColor('#111111'))
   for line in simpleSplit(f'{i:02}. {heading}','Helvetica-Bold',10,524):c.drawString(44,y,line);y-=13
   c.setFont('Helvetica',9)
   for line in simpleSplit(body,'Helvetica',9,524):c.drawString(44,y,line);y-=12
   y-=12
  if page==2:
   c.setFont('Helvetica-Bold',9);c.drawString(44,y,'Source checks and next steps');y-=13;c.setFont('Helvetica',8)
   for label,url in sources:
    c.drawString(44,y,label);y-=11
    c.drawString(44,y,url);c.linkURL(url,(44,y-2,568,y+9),relative=0);y-=15
  assert y>55,(filename,page,y)
  footer(c,page,web);c.showPage()
 c.save()

if __name__=='__main__':
 DEST.mkdir(exist_ok=True)
 build('budget-tech-cheat-sheet.pdf','Budget tech: check fit before spending',
  'Twelve checks, not a price list or a test report. No price, stock, savings or universal compatibility claim is made. Follow the exact manufacturer instructions before buying or working on hardware.',BUDGET,
  [('USB-C and DisplayLink: separate native video from USB graphics','https://www.synaptics.com/products/displaylink-graphics/usb-c'),('Electrical safety: CPSC extension-cord guidance','https://www.cpsc.gov/s3fs-public/5032.pdf')], 'stackgeist.dev/gear/')
 build('help-desk-homelab-starter-checklist.pdf','Help desk homelab starter checklist',
  'Use disposable systems, invented data and a verified recovery path. Work from the equipment you already own. These are practice plans, not evidence of completed tests.',LAB,
  [('Microsoft evaluation software: check current license and requirements','https://www.microsoft.com/en-us/evalcenter/'),('Recovery: protect the source and save recovered data elsewhere','https://support.microsoft.com/en-us/windows/experience/backup-recovery/windows-file-recovery')], 'stackgeist.dev/labs/')

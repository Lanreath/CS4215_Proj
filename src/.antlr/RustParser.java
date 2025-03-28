// Generated from /Users/fei/CS/CS4215/CS4215_Proj/src/Rust.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue"})
public class RustParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.13.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, T__1=2, T__2=3, T__3=4, T__4=5, T__5=6, T__6=7, T__7=8, T__8=9, 
		T__9=10, T__10=11, T__11=12, T__12=13, T__13=14, T__14=15, T__15=16, T__16=17, 
		T__17=18, T__18=19, T__19=20, T__20=21, T__21=22, T__22=23, T__23=24, 
		T__24=25, T__25=26, T__26=27, T__27=28, T__28=29, IDENTIFIER=30, INT=31, 
		WS=32;
	public static final int
		RULE_prog = 0, RULE_statement = 1, RULE_returnStatement = 2, RULE_variableDeclaration = 3, 
		RULE_functionDeclaration = 4, RULE_paramList = 5, RULE_param = 6, RULE_block = 7, 
		RULE_ifStatement = 8, RULE_elseBranch = 9, RULE_whileStatement = 10, RULE_assignment = 11, 
		RULE_expressionStatement = 12, RULE_expression = 13, RULE_argList = 14, 
		RULE_type = 15, RULE_breakStatement = 16;
	private static String[] makeRuleNames() {
		return new String[] {
			"prog", "statement", "returnStatement", "variableDeclaration", "functionDeclaration", 
			"paramList", "param", "block", "ifStatement", "elseBranch", "whileStatement", 
			"assignment", "expressionStatement", "expression", "argList", "type", 
			"breakStatement"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'return'", "';'", "'let'", "'mut'", "':'", "'='", "'fn'", "'('", 
			"')'", "'->'", "','", "'{'", "'}'", "'if'", "'else'", "'while'", "'*'", 
			"'&'", "'>'", "'>='", "'<'", "'<='", "'=='", "'!='", "'/'", "'+'", "'-'", 
			"'i64'", "'break'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, "IDENTIFIER", "INT", "WS"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "Rust.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public RustParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ProgContext extends ParserRuleContext {
		public TerminalNode EOF() { return getToken(RustParser.EOF, 0); }
		public List<StatementContext> statement() {
			return getRuleContexts(StatementContext.class);
		}
		public StatementContext statement(int i) {
			return getRuleContext(StatementContext.class,i);
		}
		public ProgContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_prog; }
	}

	public final ProgContext prog() throws RecognitionException {
		ProgContext _localctx = new ProgContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_prog);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(37);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & 3892793738L) != 0)) {
				{
				{
				setState(34);
				statement();
				}
				}
				setState(39);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(40);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class StatementContext extends ParserRuleContext {
		public VariableDeclarationContext variableDeclaration() {
			return getRuleContext(VariableDeclarationContext.class,0);
		}
		public FunctionDeclarationContext functionDeclaration() {
			return getRuleContext(FunctionDeclarationContext.class,0);
		}
		public AssignmentContext assignment() {
			return getRuleContext(AssignmentContext.class,0);
		}
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public IfStatementContext ifStatement() {
			return getRuleContext(IfStatementContext.class,0);
		}
		public WhileStatementContext whileStatement() {
			return getRuleContext(WhileStatementContext.class,0);
		}
		public ReturnStatementContext returnStatement() {
			return getRuleContext(ReturnStatementContext.class,0);
		}
		public BreakStatementContext breakStatement() {
			return getRuleContext(BreakStatementContext.class,0);
		}
		public ExpressionStatementContext expressionStatement() {
			return getRuleContext(ExpressionStatementContext.class,0);
		}
		public StatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_statement; }
	}

	public final StatementContext statement() throws RecognitionException {
		StatementContext _localctx = new StatementContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_statement);
		try {
			setState(51);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,1,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(42);
				variableDeclaration();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(43);
				functionDeclaration();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(44);
				assignment();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(45);
				block();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(46);
				ifStatement();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(47);
				whileStatement();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(48);
				returnStatement();
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(49);
				breakStatement();
				}
				break;
			case 9:
				enterOuterAlt(_localctx, 9);
				{
				setState(50);
				expressionStatement();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ReturnStatementContext extends ParserRuleContext {
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public ReturnStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_returnStatement; }
	}

	public final ReturnStatementContext returnStatement() throws RecognitionException {
		ReturnStatementContext _localctx = new ReturnStatementContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_returnStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(53);
			match(T__0);
			setState(55);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 3355836672L) != 0)) {
				{
				setState(54);
				expression(0);
				}
			}

			setState(57);
			match(T__1);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class VariableDeclarationContext extends ParserRuleContext {
		public Token mutFlag;
		public Token name;
		public ExpressionContext value;
		public TypeContext type() {
			return getRuleContext(TypeContext.class,0);
		}
		public TerminalNode IDENTIFIER() { return getToken(RustParser.IDENTIFIER, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public VariableDeclarationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_variableDeclaration; }
	}

	public final VariableDeclarationContext variableDeclaration() throws RecognitionException {
		VariableDeclarationContext _localctx = new VariableDeclarationContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_variableDeclaration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(59);
			match(T__2);
			setState(61);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==T__3) {
				{
				setState(60);
				((VariableDeclarationContext)_localctx).mutFlag = match(T__3);
				}
			}

			setState(63);
			((VariableDeclarationContext)_localctx).name = match(IDENTIFIER);
			setState(64);
			match(T__4);
			setState(65);
			type();
			setState(66);
			match(T__5);
			setState(67);
			((VariableDeclarationContext)_localctx).value = expression(0);
			setState(68);
			match(T__1);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class FunctionDeclarationContext extends ParserRuleContext {
		public Token name;
		public TypeContext returnType;
		public BlockContext functionBody;
		public TerminalNode IDENTIFIER() { return getToken(RustParser.IDENTIFIER, 0); }
		public TypeContext type() {
			return getRuleContext(TypeContext.class,0);
		}
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public ParamListContext paramList() {
			return getRuleContext(ParamListContext.class,0);
		}
		public FunctionDeclarationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_functionDeclaration; }
	}

	public final FunctionDeclarationContext functionDeclaration() throws RecognitionException {
		FunctionDeclarationContext _localctx = new FunctionDeclarationContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_functionDeclaration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(70);
			match(T__6);
			setState(71);
			((FunctionDeclarationContext)_localctx).name = match(IDENTIFIER);
			setState(72);
			match(T__7);
			setState(74);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==IDENTIFIER) {
				{
				setState(73);
				paramList();
				}
			}

			setState(76);
			match(T__8);
			setState(77);
			match(T__9);
			setState(78);
			((FunctionDeclarationContext)_localctx).returnType = type();
			setState(79);
			((FunctionDeclarationContext)_localctx).functionBody = block();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ParamListContext extends ParserRuleContext {
		public List<ParamContext> param() {
			return getRuleContexts(ParamContext.class);
		}
		public ParamContext param(int i) {
			return getRuleContext(ParamContext.class,i);
		}
		public ParamListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_paramList; }
	}

	public final ParamListContext paramList() throws RecognitionException {
		ParamListContext _localctx = new ParamListContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_paramList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(81);
			param();
			setState(86);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==T__10) {
				{
				{
				setState(82);
				match(T__10);
				setState(83);
				param();
				}
				}
				setState(88);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ParamContext extends ParserRuleContext {
		public Token name;
		public TypeContext type() {
			return getRuleContext(TypeContext.class,0);
		}
		public TerminalNode IDENTIFIER() { return getToken(RustParser.IDENTIFIER, 0); }
		public ParamContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_param; }
	}

	public final ParamContext param() throws RecognitionException {
		ParamContext _localctx = new ParamContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_param);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(89);
			((ParamContext)_localctx).name = match(IDENTIFIER);
			setState(90);
			match(T__4);
			setState(91);
			type();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class BlockContext extends ParserRuleContext {
		public List<StatementContext> statement() {
			return getRuleContexts(StatementContext.class);
		}
		public StatementContext statement(int i) {
			return getRuleContext(StatementContext.class,i);
		}
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public BlockContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_block; }
	}

	public final BlockContext block() throws RecognitionException {
		BlockContext _localctx = new BlockContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_block);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(93);
			match(T__11);
			setState(97);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,6,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(94);
					statement();
					}
					} 
				}
				setState(99);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,6,_ctx);
			}
			setState(101);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 3355836672L) != 0)) {
				{
				setState(100);
				expression(0);
				}
			}

			setState(103);
			match(T__12);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class IfStatementContext extends ParserRuleContext {
		public ExpressionContext condition;
		public BlockContext thenBlock;
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public ElseBranchContext elseBranch() {
			return getRuleContext(ElseBranchContext.class,0);
		}
		public IfStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_ifStatement; }
	}

	public final IfStatementContext ifStatement() throws RecognitionException {
		IfStatementContext _localctx = new IfStatementContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_ifStatement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(105);
			match(T__13);
			setState(106);
			((IfStatementContext)_localctx).condition = expression(0);
			setState(107);
			((IfStatementContext)_localctx).thenBlock = block();
			setState(109);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==T__14) {
				{
				setState(108);
				elseBranch();
				}
			}

			setState(111);
			match(T__1);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ElseBranchContext extends ParserRuleContext {
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public IfStatementContext ifStatement() {
			return getRuleContext(IfStatementContext.class,0);
		}
		public ElseBranchContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_elseBranch; }
	}

	public final ElseBranchContext elseBranch() throws RecognitionException {
		ElseBranchContext _localctx = new ElseBranchContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_elseBranch);
		try {
			setState(117);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,9,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(113);
				match(T__14);
				setState(114);
				block();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(115);
				match(T__14);
				setState(116);
				ifStatement();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class WhileStatementContext extends ParserRuleContext {
		public ExpressionContext condition;
		public BlockContext loopBlock;
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public WhileStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_whileStatement; }
	}

	public final WhileStatementContext whileStatement() throws RecognitionException {
		WhileStatementContext _localctx = new WhileStatementContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_whileStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(119);
			match(T__15);
			setState(120);
			((WhileStatementContext)_localctx).condition = expression(0);
			setState(121);
			((WhileStatementContext)_localctx).loopBlock = block();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class AssignmentContext extends ParserRuleContext {
		public AssignmentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_assignment; }
	 
		public AssignmentContext() { }
		public void copyFrom(AssignmentContext ctx) {
			super.copyFrom(ctx);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class DereferenceAssignmentContext extends AssignmentContext {
		public ExpressionContext target;
		public ExpressionContext value;
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public DereferenceAssignmentContext(AssignmentContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class StandardAssignmentContext extends AssignmentContext {
		public TerminalNode IDENTIFIER() { return getToken(RustParser.IDENTIFIER, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public StandardAssignmentContext(AssignmentContext ctx) { copyFrom(ctx); }
	}

	public final AssignmentContext assignment() throws RecognitionException {
		AssignmentContext _localctx = new AssignmentContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_assignment);
		try {
			setState(134);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case IDENTIFIER:
				_localctx = new StandardAssignmentContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(123);
				match(IDENTIFIER);
				setState(124);
				match(T__5);
				setState(125);
				expression(0);
				setState(126);
				match(T__1);
				}
				break;
			case T__16:
				_localctx = new DereferenceAssignmentContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(128);
				match(T__16);
				setState(129);
				((DereferenceAssignmentContext)_localctx).target = expression(0);
				setState(130);
				match(T__5);
				setState(131);
				((DereferenceAssignmentContext)_localctx).value = expression(0);
				setState(132);
				match(T__1);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ExpressionStatementContext extends ParserRuleContext {
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public ExpressionStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_expressionStatement; }
	}

	public final ExpressionStatementContext expressionStatement() throws RecognitionException {
		ExpressionStatementContext _localctx = new ExpressionStatementContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_expressionStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(136);
			expression(0);
			setState(137);
			match(T__1);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ExpressionContext extends ParserRuleContext {
		public ExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_expression; }
	 
		public ExpressionContext() { }
		public void copyFrom(ExpressionContext ctx) {
			super.copyFrom(ctx);
		}
	}
	@SuppressWarnings("CheckReturnValue")
	public static class IdentifierContext extends ExpressionContext {
		public TerminalNode IDENTIFIER() { return getToken(RustParser.IDENTIFIER, 0); }
		public IdentifierContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class DereferenceExprContext extends ExpressionContext {
		public ExpressionContext target;
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public DereferenceExprContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class ReferenceExprContext extends ExpressionContext {
		public Token mutFlag;
		public ExpressionContext target;
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public ReferenceExprContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class EqualityOpContext extends ExpressionContext {
		public ExpressionContext left;
		public Token op;
		public ExpressionContext right;
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public EqualityOpContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class FunctionCallContext extends ExpressionContext {
		public TerminalNode IDENTIFIER() { return getToken(RustParser.IDENTIFIER, 0); }
		public ArgListContext argList() {
			return getRuleContext(ArgListContext.class,0);
		}
		public FunctionCallContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class UnaryOpContext extends ExpressionContext {
		public ExpressionContext operand;
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public UnaryOpContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class MulDivOpContext extends ExpressionContext {
		public ExpressionContext left;
		public Token op;
		public ExpressionContext right;
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public MulDivOpContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class ParenExprContext extends ExpressionContext {
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public ParenExprContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class IntContext extends ExpressionContext {
		public TerminalNode INT() { return getToken(RustParser.INT, 0); }
		public IntContext(ExpressionContext ctx) { copyFrom(ctx); }
	}
	@SuppressWarnings("CheckReturnValue")
	public static class AddSubOpContext extends ExpressionContext {
		public ExpressionContext left;
		public Token op;
		public ExpressionContext right;
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public AddSubOpContext(ExpressionContext ctx) { copyFrom(ctx); }
	}

	public final ExpressionContext expression() throws RecognitionException {
		return expression(0);
	}

	private ExpressionContext expression(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		ExpressionContext _localctx = new ExpressionContext(_ctx, _parentState);
		ExpressionContext _prevctx = _localctx;
		int _startState = 26;
		enterRecursionRule(_localctx, 26, RULE_expression, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(161);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,13,_ctx) ) {
			case 1:
				{
				_localctx = new ParenExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;

				setState(140);
				match(T__7);
				setState(141);
				expression(0);
				setState(142);
				match(T__8);
				}
				break;
			case 2:
				{
				_localctx = new ReferenceExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(144);
				match(T__17);
				setState(146);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==T__3) {
					{
					setState(145);
					((ReferenceExprContext)_localctx).mutFlag = match(T__3);
					}
				}

				setState(148);
				((ReferenceExprContext)_localctx).target = expression(9);
				}
				break;
			case 3:
				{
				_localctx = new DereferenceExprContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(149);
				match(T__16);
				setState(150);
				((DereferenceExprContext)_localctx).target = expression(8);
				}
				break;
			case 4:
				{
				_localctx = new UnaryOpContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(151);
				match(T__26);
				setState(152);
				((UnaryOpContext)_localctx).operand = expression(4);
				}
				break;
			case 5:
				{
				_localctx = new FunctionCallContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(153);
				match(IDENTIFIER);
				setState(154);
				match(T__7);
				setState(156);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 3355836672L) != 0)) {
					{
					setState(155);
					argList();
					}
				}

				setState(158);
				match(T__8);
				}
				break;
			case 6:
				{
				_localctx = new IdentifierContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(159);
				match(IDENTIFIER);
				}
				break;
			case 7:
				{
				_localctx = new IntContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(160);
				match(INT);
				}
				break;
			}
			_ctx.stop = _input.LT(-1);
			setState(174);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,15,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(172);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,14,_ctx) ) {
					case 1:
						{
						_localctx = new EqualityOpContext(new ExpressionContext(_parentctx, _parentState));
						((EqualityOpContext)_localctx).left = _prevctx;
						pushNewRecursionContext(_localctx, _startState, RULE_expression);
						setState(163);
						if (!(precpred(_ctx, 7))) throw new FailedPredicateException(this, "precpred(_ctx, 7)");
						setState(164);
						((EqualityOpContext)_localctx).op = _input.LT(1);
						_la = _input.LA(1);
						if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 33030144L) != 0)) ) {
							((EqualityOpContext)_localctx).op = (Token)_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(165);
						((EqualityOpContext)_localctx).right = expression(8);
						}
						break;
					case 2:
						{
						_localctx = new MulDivOpContext(new ExpressionContext(_parentctx, _parentState));
						((MulDivOpContext)_localctx).left = _prevctx;
						pushNewRecursionContext(_localctx, _startState, RULE_expression);
						setState(166);
						if (!(precpred(_ctx, 6))) throw new FailedPredicateException(this, "precpred(_ctx, 6)");
						setState(167);
						((MulDivOpContext)_localctx).op = _input.LT(1);
						_la = _input.LA(1);
						if ( !(_la==T__16 || _la==T__24) ) {
							((MulDivOpContext)_localctx).op = (Token)_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(168);
						((MulDivOpContext)_localctx).right = expression(7);
						}
						break;
					case 3:
						{
						_localctx = new AddSubOpContext(new ExpressionContext(_parentctx, _parentState));
						((AddSubOpContext)_localctx).left = _prevctx;
						pushNewRecursionContext(_localctx, _startState, RULE_expression);
						setState(169);
						if (!(precpred(_ctx, 5))) throw new FailedPredicateException(this, "precpred(_ctx, 5)");
						setState(170);
						((AddSubOpContext)_localctx).op = _input.LT(1);
						_la = _input.LA(1);
						if ( !(_la==T__25 || _la==T__26) ) {
							((AddSubOpContext)_localctx).op = (Token)_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(171);
						((AddSubOpContext)_localctx).right = expression(6);
						}
						break;
					}
					} 
				}
				setState(176);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,15,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ArgListContext extends ParserRuleContext {
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public ArgListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_argList; }
	}

	public final ArgListContext argList() throws RecognitionException {
		ArgListContext _localctx = new ArgListContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_argList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(177);
			expression(0);
			setState(182);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==T__10) {
				{
				{
				setState(178);
				match(T__10);
				setState(179);
				expression(0);
				}
				}
				setState(184);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TypeContext extends ParserRuleContext {
		public Token refFlag;
		public Token mutFlag;
		public TypeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_type; }
	}

	public final TypeContext type() throws RecognitionException {
		TypeContext _localctx = new TypeContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_type);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(189);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==T__17) {
				{
				setState(185);
				((TypeContext)_localctx).refFlag = match(T__17);
				setState(187);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==T__3) {
					{
					setState(186);
					((TypeContext)_localctx).mutFlag = match(T__3);
					}
				}

				}
			}

			setState(191);
			match(T__27);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class BreakStatementContext extends ParserRuleContext {
		public BreakStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_breakStatement; }
	}

	public final BreakStatementContext breakStatement() throws RecognitionException {
		BreakStatementContext _localctx = new BreakStatementContext(_ctx, getState());
		enterRule(_localctx, 32, RULE_breakStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(193);
			match(T__28);
			setState(194);
			match(T__1);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public boolean sempred(RuleContext _localctx, int ruleIndex, int predIndex) {
		switch (ruleIndex) {
		case 13:
			return expression_sempred((ExpressionContext)_localctx, predIndex);
		}
		return true;
	}
	private boolean expression_sempred(ExpressionContext _localctx, int predIndex) {
		switch (predIndex) {
		case 0:
			return precpred(_ctx, 7);
		case 1:
			return precpred(_ctx, 6);
		case 2:
			return precpred(_ctx, 5);
		}
		return true;
	}

	public static final String _serializedATN =
		"\u0004\u0001 \u00c5\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001\u0002"+
		"\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002\u0004\u0007\u0004\u0002"+
		"\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002\u0007\u0007\u0007\u0002"+
		"\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0002\u000b\u0007\u000b\u0002"+
		"\f\u0007\f\u0002\r\u0007\r\u0002\u000e\u0007\u000e\u0002\u000f\u0007\u000f"+
		"\u0002\u0010\u0007\u0010\u0001\u0000\u0005\u0000$\b\u0000\n\u0000\f\u0000"+
		"\'\t\u0000\u0001\u0000\u0001\u0000\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0003\u00014\b\u0001\u0001\u0002\u0001\u0002\u0003\u00028\b\u0002\u0001"+
		"\u0002\u0001\u0002\u0001\u0003\u0001\u0003\u0003\u0003>\b\u0003\u0001"+
		"\u0003\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0003\u0001"+
		"\u0003\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0003\u0004K\b"+
		"\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001"+
		"\u0005\u0001\u0005\u0001\u0005\u0005\u0005U\b\u0005\n\u0005\f\u0005X\t"+
		"\u0005\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0007\u0001"+
		"\u0007\u0005\u0007`\b\u0007\n\u0007\f\u0007c\t\u0007\u0001\u0007\u0003"+
		"\u0007f\b\u0007\u0001\u0007\u0001\u0007\u0001\b\u0001\b\u0001\b\u0001"+
		"\b\u0003\bn\b\b\u0001\b\u0001\b\u0001\t\u0001\t\u0001\t\u0001\t\u0003"+
		"\tv\b\t\u0001\n\u0001\n\u0001\n\u0001\n\u0001\u000b\u0001\u000b\u0001"+
		"\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001"+
		"\u000b\u0001\u000b\u0001\u000b\u0003\u000b\u0087\b\u000b\u0001\f\u0001"+
		"\f\u0001\f\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0003"+
		"\r\u0093\b\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001"+
		"\r\u0003\r\u009d\b\r\u0001\r\u0001\r\u0001\r\u0003\r\u00a2\b\r\u0001\r"+
		"\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0005"+
		"\r\u00ad\b\r\n\r\f\r\u00b0\t\r\u0001\u000e\u0001\u000e\u0001\u000e\u0005"+
		"\u000e\u00b5\b\u000e\n\u000e\f\u000e\u00b8\t\u000e\u0001\u000f\u0001\u000f"+
		"\u0003\u000f\u00bc\b\u000f\u0003\u000f\u00be\b\u000f\u0001\u000f\u0001"+
		"\u000f\u0001\u0010\u0001\u0010\u0001\u0010\u0001\u0010\u0000\u0001\u001a"+
		"\u0011\u0000\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018"+
		"\u001a\u001c\u001e \u0000\u0003\u0001\u0000\u0013\u0018\u0002\u0000\u0011"+
		"\u0011\u0019\u0019\u0001\u0000\u001a\u001b\u00d3\u0000%\u0001\u0000\u0000"+
		"\u0000\u00023\u0001\u0000\u0000\u0000\u00045\u0001\u0000\u0000\u0000\u0006"+
		";\u0001\u0000\u0000\u0000\bF\u0001\u0000\u0000\u0000\nQ\u0001\u0000\u0000"+
		"\u0000\fY\u0001\u0000\u0000\u0000\u000e]\u0001\u0000\u0000\u0000\u0010"+
		"i\u0001\u0000\u0000\u0000\u0012u\u0001\u0000\u0000\u0000\u0014w\u0001"+
		"\u0000\u0000\u0000\u0016\u0086\u0001\u0000\u0000\u0000\u0018\u0088\u0001"+
		"\u0000\u0000\u0000\u001a\u00a1\u0001\u0000\u0000\u0000\u001c\u00b1\u0001"+
		"\u0000\u0000\u0000\u001e\u00bd\u0001\u0000\u0000\u0000 \u00c1\u0001\u0000"+
		"\u0000\u0000\"$\u0003\u0002\u0001\u0000#\"\u0001\u0000\u0000\u0000$\'"+
		"\u0001\u0000\u0000\u0000%#\u0001\u0000\u0000\u0000%&\u0001\u0000\u0000"+
		"\u0000&(\u0001\u0000\u0000\u0000\'%\u0001\u0000\u0000\u0000()\u0005\u0000"+
		"\u0000\u0001)\u0001\u0001\u0000\u0000\u0000*4\u0003\u0006\u0003\u0000"+
		"+4\u0003\b\u0004\u0000,4\u0003\u0016\u000b\u0000-4\u0003\u000e\u0007\u0000"+
		".4\u0003\u0010\b\u0000/4\u0003\u0014\n\u000004\u0003\u0004\u0002\u0000"+
		"14\u0003 \u0010\u000024\u0003\u0018\f\u00003*\u0001\u0000\u0000\u0000"+
		"3+\u0001\u0000\u0000\u00003,\u0001\u0000\u0000\u00003-\u0001\u0000\u0000"+
		"\u00003.\u0001\u0000\u0000\u00003/\u0001\u0000\u0000\u000030\u0001\u0000"+
		"\u0000\u000031\u0001\u0000\u0000\u000032\u0001\u0000\u0000\u00004\u0003"+
		"\u0001\u0000\u0000\u000057\u0005\u0001\u0000\u000068\u0003\u001a\r\u0000"+
		"76\u0001\u0000\u0000\u000078\u0001\u0000\u0000\u000089\u0001\u0000\u0000"+
		"\u00009:\u0005\u0002\u0000\u0000:\u0005\u0001\u0000\u0000\u0000;=\u0005"+
		"\u0003\u0000\u0000<>\u0005\u0004\u0000\u0000=<\u0001\u0000\u0000\u0000"+
		"=>\u0001\u0000\u0000\u0000>?\u0001\u0000\u0000\u0000?@\u0005\u001e\u0000"+
		"\u0000@A\u0005\u0005\u0000\u0000AB\u0003\u001e\u000f\u0000BC\u0005\u0006"+
		"\u0000\u0000CD\u0003\u001a\r\u0000DE\u0005\u0002\u0000\u0000E\u0007\u0001"+
		"\u0000\u0000\u0000FG\u0005\u0007\u0000\u0000GH\u0005\u001e\u0000\u0000"+
		"HJ\u0005\b\u0000\u0000IK\u0003\n\u0005\u0000JI\u0001\u0000\u0000\u0000"+
		"JK\u0001\u0000\u0000\u0000KL\u0001\u0000\u0000\u0000LM\u0005\t\u0000\u0000"+
		"MN\u0005\n\u0000\u0000NO\u0003\u001e\u000f\u0000OP\u0003\u000e\u0007\u0000"+
		"P\t\u0001\u0000\u0000\u0000QV\u0003\f\u0006\u0000RS\u0005\u000b\u0000"+
		"\u0000SU\u0003\f\u0006\u0000TR\u0001\u0000\u0000\u0000UX\u0001\u0000\u0000"+
		"\u0000VT\u0001\u0000\u0000\u0000VW\u0001\u0000\u0000\u0000W\u000b\u0001"+
		"\u0000\u0000\u0000XV\u0001\u0000\u0000\u0000YZ\u0005\u001e\u0000\u0000"+
		"Z[\u0005\u0005\u0000\u0000[\\\u0003\u001e\u000f\u0000\\\r\u0001\u0000"+
		"\u0000\u0000]a\u0005\f\u0000\u0000^`\u0003\u0002\u0001\u0000_^\u0001\u0000"+
		"\u0000\u0000`c\u0001\u0000\u0000\u0000a_\u0001\u0000\u0000\u0000ab\u0001"+
		"\u0000\u0000\u0000be\u0001\u0000\u0000\u0000ca\u0001\u0000\u0000\u0000"+
		"df\u0003\u001a\r\u0000ed\u0001\u0000\u0000\u0000ef\u0001\u0000\u0000\u0000"+
		"fg\u0001\u0000\u0000\u0000gh\u0005\r\u0000\u0000h\u000f\u0001\u0000\u0000"+
		"\u0000ij\u0005\u000e\u0000\u0000jk\u0003\u001a\r\u0000km\u0003\u000e\u0007"+
		"\u0000ln\u0003\u0012\t\u0000ml\u0001\u0000\u0000\u0000mn\u0001\u0000\u0000"+
		"\u0000no\u0001\u0000\u0000\u0000op\u0005\u0002\u0000\u0000p\u0011\u0001"+
		"\u0000\u0000\u0000qr\u0005\u000f\u0000\u0000rv\u0003\u000e\u0007\u0000"+
		"st\u0005\u000f\u0000\u0000tv\u0003\u0010\b\u0000uq\u0001\u0000\u0000\u0000"+
		"us\u0001\u0000\u0000\u0000v\u0013\u0001\u0000\u0000\u0000wx\u0005\u0010"+
		"\u0000\u0000xy\u0003\u001a\r\u0000yz\u0003\u000e\u0007\u0000z\u0015\u0001"+
		"\u0000\u0000\u0000{|\u0005\u001e\u0000\u0000|}\u0005\u0006\u0000\u0000"+
		"}~\u0003\u001a\r\u0000~\u007f\u0005\u0002\u0000\u0000\u007f\u0087\u0001"+
		"\u0000\u0000\u0000\u0080\u0081\u0005\u0011\u0000\u0000\u0081\u0082\u0003"+
		"\u001a\r\u0000\u0082\u0083\u0005\u0006\u0000\u0000\u0083\u0084\u0003\u001a"+
		"\r\u0000\u0084\u0085\u0005\u0002\u0000\u0000\u0085\u0087\u0001\u0000\u0000"+
		"\u0000\u0086{\u0001\u0000\u0000\u0000\u0086\u0080\u0001\u0000\u0000\u0000"+
		"\u0087\u0017\u0001\u0000\u0000\u0000\u0088\u0089\u0003\u001a\r\u0000\u0089"+
		"\u008a\u0005\u0002\u0000\u0000\u008a\u0019\u0001\u0000\u0000\u0000\u008b"+
		"\u008c\u0006\r\uffff\uffff\u0000\u008c\u008d\u0005\b\u0000\u0000\u008d"+
		"\u008e\u0003\u001a\r\u0000\u008e\u008f\u0005\t\u0000\u0000\u008f\u00a2"+
		"\u0001\u0000\u0000\u0000\u0090\u0092\u0005\u0012\u0000\u0000\u0091\u0093"+
		"\u0005\u0004\u0000\u0000\u0092\u0091\u0001\u0000\u0000\u0000\u0092\u0093"+
		"\u0001\u0000\u0000\u0000\u0093\u0094\u0001\u0000\u0000\u0000\u0094\u00a2"+
		"\u0003\u001a\r\t\u0095\u0096\u0005\u0011\u0000\u0000\u0096\u00a2\u0003"+
		"\u001a\r\b\u0097\u0098\u0005\u001b\u0000\u0000\u0098\u00a2\u0003\u001a"+
		"\r\u0004\u0099\u009a\u0005\u001e\u0000\u0000\u009a\u009c\u0005\b\u0000"+
		"\u0000\u009b\u009d\u0003\u001c\u000e\u0000\u009c\u009b\u0001\u0000\u0000"+
		"\u0000\u009c\u009d\u0001\u0000\u0000\u0000\u009d\u009e\u0001\u0000\u0000"+
		"\u0000\u009e\u00a2\u0005\t\u0000\u0000\u009f\u00a2\u0005\u001e\u0000\u0000"+
		"\u00a0\u00a2\u0005\u001f\u0000\u0000\u00a1\u008b\u0001\u0000\u0000\u0000"+
		"\u00a1\u0090\u0001\u0000\u0000\u0000\u00a1\u0095\u0001\u0000\u0000\u0000"+
		"\u00a1\u0097\u0001\u0000\u0000\u0000\u00a1\u0099\u0001\u0000\u0000\u0000"+
		"\u00a1\u009f\u0001\u0000\u0000\u0000\u00a1\u00a0\u0001\u0000\u0000\u0000"+
		"\u00a2\u00ae\u0001\u0000\u0000\u0000\u00a3\u00a4\n\u0007\u0000\u0000\u00a4"+
		"\u00a5\u0007\u0000\u0000\u0000\u00a5\u00ad\u0003\u001a\r\b\u00a6\u00a7"+
		"\n\u0006\u0000\u0000\u00a7\u00a8\u0007\u0001\u0000\u0000\u00a8\u00ad\u0003"+
		"\u001a\r\u0007\u00a9\u00aa\n\u0005\u0000\u0000\u00aa\u00ab\u0007\u0002"+
		"\u0000\u0000\u00ab\u00ad\u0003\u001a\r\u0006\u00ac\u00a3\u0001\u0000\u0000"+
		"\u0000\u00ac\u00a6\u0001\u0000\u0000\u0000\u00ac\u00a9\u0001\u0000\u0000"+
		"\u0000\u00ad\u00b0\u0001\u0000\u0000\u0000\u00ae\u00ac\u0001\u0000\u0000"+
		"\u0000\u00ae\u00af\u0001\u0000\u0000\u0000\u00af\u001b\u0001\u0000\u0000"+
		"\u0000\u00b0\u00ae\u0001\u0000\u0000\u0000\u00b1\u00b6\u0003\u001a\r\u0000"+
		"\u00b2\u00b3\u0005\u000b\u0000\u0000\u00b3\u00b5\u0003\u001a\r\u0000\u00b4"+
		"\u00b2\u0001\u0000\u0000\u0000\u00b5\u00b8\u0001\u0000\u0000\u0000\u00b6"+
		"\u00b4\u0001\u0000\u0000\u0000\u00b6\u00b7\u0001\u0000\u0000\u0000\u00b7"+
		"\u001d\u0001\u0000\u0000\u0000\u00b8\u00b6\u0001\u0000\u0000\u0000\u00b9"+
		"\u00bb\u0005\u0012\u0000\u0000\u00ba\u00bc\u0005\u0004\u0000\u0000\u00bb"+
		"\u00ba\u0001\u0000\u0000\u0000\u00bb\u00bc\u0001\u0000\u0000\u0000\u00bc"+
		"\u00be\u0001\u0000\u0000\u0000\u00bd\u00b9\u0001\u0000\u0000\u0000\u00bd"+
		"\u00be\u0001\u0000\u0000\u0000\u00be\u00bf\u0001\u0000\u0000\u0000\u00bf"+
		"\u00c0\u0005\u001c\u0000\u0000\u00c0\u001f\u0001\u0000\u0000\u0000\u00c1"+
		"\u00c2\u0005\u001d\u0000\u0000\u00c2\u00c3\u0005\u0002\u0000\u0000\u00c3"+
		"!\u0001\u0000\u0000\u0000\u0013%37=JVaemu\u0086\u0092\u009c\u00a1\u00ac"+
		"\u00ae\u00b6\u00bb\u00bd";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}